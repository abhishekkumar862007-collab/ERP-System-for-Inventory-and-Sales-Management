package com.erp.system.controller;

import com.erp.system.entity.Supplier;
import com.erp.system.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.createSupplier(supplier));
    }
}
