package com.erp.system.controller;

import com.erp.system.dto.DashboardSummaryDto;
import com.erp.system.entity.Product;
import com.erp.system.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/sales-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'SALES_EXECUTIVE', 'PURCHASE_MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<DashboardSummaryDto> getSalesSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @GetMapping("/purchase-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT', 'PURCHASE_MANAGER')")
    public ResponseEntity<DashboardSummaryDto> getPurchaseSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @GetMapping("/stock-alerts")
    @PreAuthorize("hasAnyRole('ADMIN', 'INVENTORY_MANAGER', 'PURCHASE_MANAGER')")
    public ResponseEntity<List<Product>> getStockAlerts() {
        return ResponseEntity.ok(dashboardService.getLowStockAlerts());
    }
}
