package com.erp.system.repository;

import com.erp.system.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    
    @Query("SELECT p FROM Product p WHERE p.currentStock <= p.reorderLevel")
    List<Product> findLowStockProducts();
}
