package com.erp.system.controller;

import com.erp.system.dto.InvoiceRequest;
import com.erp.system.dto.StatusUpdateRequest;
import com.erp.system.entity.Invoice;
import com.erp.system.service.InvoiceService;
import com.erp.system.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfService pdfService;

    public InvoiceController(InvoiceService invoiceService, PdfService pdfService) {
        this.invoiceService = invoiceService;
        this.pdfService = pdfService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE', 'ACCOUNTANT')")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE', 'ACCOUNTANT')")
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.createInvoice(request.getSalesOrderId()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<Invoice> updateInvoiceStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Invoice.InvoiceStatus status = Invoice.InvoiceStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(id, status));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE', 'ACCOUNTANT')")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable Long id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        byte[] pdfBytes = pdfService.generateInvoicePdf(invoice);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice_" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
