package com.erp.system.repository;

import com.erp.system.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    List<SalesOrder> findByStatus(SalesOrder.SalesOrderStatus status);
}
