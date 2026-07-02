package com.erp.system.controller;

import com.erp.system.dto.GrnRequest;
import com.erp.system.entity.GRN;
import com.erp.system.service.GrnService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grns")
public class GrnController {

    private final GrnService grnService;

    public GrnController(GrnService grnService) {
        this.grnService = grnService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<List<GRN>> getAllGrns() {
        return ResponseEntity.ok(grnService.getAllGrns());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER', 'INVENTORY_MANAGER')")
    public ResponseEntity<GRN> createGrn(@RequestBody GrnRequest request) {
        return ResponseEntity.ok(grnService.createGrn(request));
    }
}
