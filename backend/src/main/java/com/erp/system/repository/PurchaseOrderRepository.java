package com.erp.system.repository;

import com.erp.system.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByStatus(PurchaseOrder.PurchaseOrderStatus status);
}
