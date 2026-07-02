package com.erp.system.service;

import com.erp.system.entity.Product;
import com.erp.system.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional
    public Product createProduct(Product product) {
        if (productRepository.findBySku(product.getSku()).isPresent()) {
            throw new RuntimeException("Product with SKU already exists: " + product.getSku());
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product details) {
        Product product = getProductById(id);
        product.setName(details.getName());
        product.setCategory(details.getCategory());
        product.setUnitPrice(details.getUnitPrice());
        product.setCurrentStock(details.getCurrentStock());
        product.setReorderLevel(details.getReorderLevel());
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
