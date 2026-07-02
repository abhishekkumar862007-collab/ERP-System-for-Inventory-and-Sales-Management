package com.erp.system.service;

import com.erp.system.dto.*;
import com.erp.system.entity.*;
import com.erp.system.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final InvoiceService invoiceService;

    public OrderService(SalesOrderRepository salesOrderRepository,
                        PurchaseOrderRepository purchaseOrderRepository,
                        CustomerRepository customerRepository,
                        SupplierRepository supplierRepository,
                        ProductRepository productRepository,
                        InvoiceService invoiceService) {
        this.salesOrderRepository = salesOrderRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.invoiceService = invoiceService;
    }

    // --- SALES ORDERS ---

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public SalesOrder getSalesOrderById(Long id) {
        return salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found with id: " + id));
    }

    @Transactional
    public SalesOrder createSalesOrder(SalesOrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        SalesOrder order = new SalesOrder();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(SalesOrder.SalesOrderStatus.PENDING);
        order.setTotalAmount(0.0);

        double totalAmount = 0.0;
        List<SalesOrderItem> items = new ArrayList<>();

        for (SalesOrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            SalesOrderItem orderItem = new SalesOrderItem();
            orderItem.setSalesOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(product.getUnitPrice());

            totalAmount += product.getUnitPrice() * itemReq.getQuantity();
            items.add(orderItem);
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        return salesOrderRepository.save(order);
    }

    @Transactional
    public SalesOrder updateSalesOrderStatus(Long id, SalesOrder.SalesOrderStatus status) {
        SalesOrder order = getSalesOrderById(id);
        
        // If transitioning to DISPATCHED, deduct inventory stock
        if (status == SalesOrder.SalesOrderStatus.DISPATCHED && order.getStatus() != SalesOrder.SalesOrderStatus.DISPATCHED) {
            for (SalesOrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (product.getCurrentStock() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName() 
                            + " (Required: " + item.getQuantity() + ", Available: " + product.getCurrentStock() + ")");
                }
                product.setCurrentStock(product.getCurrentStock() - item.getQuantity());
                productRepository.save(product);
            }
        }
        
        order.setStatus(status);
        SalesOrder savedOrder = salesOrderRepository.save(order);

        // Auto-generate invoice when order is approved
        if (status == SalesOrder.SalesOrderStatus.APPROVED) {
            invoiceService.createInvoice(savedOrder.getId());
        }

        return savedOrder;
    }

    // --- PURCHASE ORDERS ---

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found with id: " + id));
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setOrderDate(LocalDateTime.now());
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
        order.setStatus(PurchaseOrder.PurchaseOrderStatus.ORDERED);

        List<PurchaseOrderItem> items = new ArrayList<>();

        for (PurchaseOrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            PurchaseOrderItem orderItem = new PurchaseOrderItem();
            orderItem.setPurchaseOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());

            items.add(orderItem);
        }

        order.setItems(items);
        return purchaseOrderRepository.save(order);
    }

    @Transactional
    public PurchaseOrder updatePurchaseOrderStatus(Long id, PurchaseOrder.PurchaseOrderStatus status) {
        PurchaseOrder order = getPurchaseOrderById(id);
        order.setStatus(status);
        return purchaseOrderRepository.save(order);
    }
}
