package com.erp.system.service;

import com.erp.system.entity.Product;
import com.erp.system.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProduct_Success() {
        Product product = new Product(null, "Test Mouse", "MS-TST-01", "Peripherals", 20.0, 50, 10);
        when(productRepository.findBySku("MS-TST-01")).thenReturn(Optional.empty());
        when(productRepository.save(product)).thenReturn(product);

        Product result = productService.createProduct(product);

        assertNotNull(result);
        assertEquals("Test Mouse", result.getName());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testCreateProduct_DuplicateSku() {
        Product product = new Product(null, "Test Mouse", "MS-TST-01", "Peripherals", 20.0, 50, 10);
        when(productRepository.findBySku("MS-TST-01")).thenReturn(Optional.of(product));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.createProduct(product);
        });

        assertTrue(exception.getMessage().contains("SKU already exists"));
        verify(productRepository, never()).save(any());
    }
}
