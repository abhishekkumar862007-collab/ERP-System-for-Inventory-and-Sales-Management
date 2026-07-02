package com.erp.system.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderRequest {
    private Long supplierId;
    private LocalDate expectedDeliveryDate;
    private List<PurchaseOrderItemRequest> items;
}
