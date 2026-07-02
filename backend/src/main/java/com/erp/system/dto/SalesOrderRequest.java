package com.erp.system.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderRequest {
    private Long customerId;
    private List<SalesOrderItemRequest> items;
}
