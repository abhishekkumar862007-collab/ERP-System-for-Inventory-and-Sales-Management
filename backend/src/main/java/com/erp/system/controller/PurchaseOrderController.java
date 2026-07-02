package com.erp.system.controller;

import com.erp.system.dto.PurchaseOrderRequest;
import com.erp.system.dto.StatusUpdateRequest;
import com.erp.system.entity.PurchaseOrder;
import com.erp.system.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final OrderService orderService;

    public PurchaseOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {
        return ResponseEntity.ok(orderService.getAllPurchaseOrders());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.ok(orderService.createPurchaseOrder(request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        PurchaseOrder.PurchaseOrderStatus status = PurchaseOrder.PurchaseOrderStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(orderService.updatePurchaseOrderStatus(id, status));
    }
}
