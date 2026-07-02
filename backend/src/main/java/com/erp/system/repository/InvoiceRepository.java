package com.erp.system.repository;

import com.erp.system.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
}
