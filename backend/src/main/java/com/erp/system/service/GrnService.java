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
public class GrnService {

    private final GRNRepository grnRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;

    public GrnService(GRNRepository grnRepository,
                      PurchaseOrderRepository purchaseOrderRepository,
                      ProductRepository productRepository) {
        this.grnRepository = grnRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.productRepository = productRepository;
    }

    public List<GRN> getAllGrns() {
        return grnRepository.findAll();
    }

    @Transactional
    public GRN createGrn(GrnRequest request) {
        PurchaseOrder po = purchaseOrderRepository.findById(request.getPurchaseOrderId())
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

        if (po.getStatus() == PurchaseOrder.PurchaseOrderStatus.RECEIVED) {
            throw new RuntimeException("Purchase Order has already been fully received");
        }

        GRN grn = new GRN();
        grn.setPurchaseOrder(po);
        grn.setReceivedDate(LocalDateTime.now());
        grn.setRemarks(request.getRemarks());

        List<GRNItem> grnItems = new ArrayList<>();
        for (GrnItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            GRNItem grnItem = new GRNItem();
            grnItem.setGrn(grn);
            grnItem.setProduct(product);
            grnItem.setQuantityReceived(itemReq.getQuantityReceived());

            // Increment product stock
            product.setCurrentStock(product.getCurrentStock() + itemReq.getQuantityReceived());
            productRepository.save(product);

            grnItems.add(grnItem);
        }

        grn.setItems(grnItems);

        // Update purchase order status to RECEIVED
        po.setStatus(PurchaseOrder.PurchaseOrderStatus.RECEIVED);
        purchaseOrderRepository.save(po);

        return grnRepository.save(grn);
    }
}
