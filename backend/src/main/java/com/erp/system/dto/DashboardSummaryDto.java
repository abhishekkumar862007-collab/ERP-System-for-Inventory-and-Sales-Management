package com.erp.system.dto;

import com.erp.system.entity.Invoice;
import com.erp.system.entity.Product;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private Double totalSales;
    private Integer totalOrders;
    private Integer newCustomers;
    private Double stockValue;
    private List<SalesTrendDto> salesTrend;
    private List<Product> lowStockItems;
    private List<Invoice> recentInvoices;
}
