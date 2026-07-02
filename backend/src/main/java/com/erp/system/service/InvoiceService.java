package com.erp.system.service;

import com.erp.system.entity.Invoice;
import com.erp.system.entity.SalesOrder;
import com.erp.system.repository.InvoiceRepository;
import com.erp.system.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final SalesOrderRepository salesOrderRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, SalesOrderRepository salesOrderRepository) {
        this.invoiceRepository = invoiceRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
    }

    @Transactional
    public Invoice createInvoice(Long salesOrderId) {
        SalesOrder salesOrder = salesOrderRepository.findById(salesOrderId)
                .orElseThrow(() -> new RuntimeException("Sales Order not found"));

        if (salesOrder.getStatus() == SalesOrder.SalesOrderStatus.PENDING) {
            throw new RuntimeException("Cannot generate invoice for a PENDING Sales Order. Please approve it first.");
        }

        // Check if invoice already exists for this sales order
        // If it exists, return it or throw an error. Let's return it to avoid duplication.
        for (Invoice existing : invoiceRepository.findAll()) {
            if (existing.getSalesOrder().getId().equals(salesOrderId)) {
                return existing;
            }
        }

        double totalAmount = salesOrder.getTotalAmount();
        double taxAmount = totalAmount * 0.18; // 18% GST
        double totalPayable = totalAmount + taxAmount;

        Invoice invoice = new Invoice();
        invoice.setSalesOrder(salesOrder);
        invoice.setInvoiceDate(LocalDateTime.now());
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalPayable(totalPayable);
        invoice.setStatus(Invoice.InvoiceStatus.UNPAID);

        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice updateInvoiceStatus(Long id, Invoice.InvoiceStatus status) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }
}
