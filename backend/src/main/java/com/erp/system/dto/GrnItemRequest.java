package com.erp.system.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrnItemRequest {
    private Long productId;
    private Integer quantityReceived;
}
