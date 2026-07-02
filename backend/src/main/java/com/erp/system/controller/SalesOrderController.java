package com.erp.system.controller;

import com.erp.system.dto.SalesOrderRequest;
import com.erp.system.dto.StatusUpdateRequest;
import com.erp.system.entity.SalesOrder;
import com.erp.system.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
public class SalesOrderController {

    private final OrderService orderService;

    public SalesOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE')")
    public ResponseEntity<List<SalesOrder>> getAllSalesOrders() {
        return ResponseEntity.ok(orderService.getAllSalesOrders());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrder> createSalesOrder(@RequestBody SalesOrderRequest request) {
        return ResponseEntity.ok(orderService.createSalesOrder(request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXECUTIVE')")
    public ResponseEntity<SalesOrder> updateSalesOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        SalesOrder.SalesOrderStatus status = SalesOrder.SalesOrderStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(orderService.updateSalesOrderStatus(id, status));
    }
}
