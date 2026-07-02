package com.erp.system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GRN {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(nullable = false)
    private LocalDateTime receivedDate;

    private String remarks;

    @OneToMany(mappedBy = "grn", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<GRNItem> items = new ArrayList<>();
}
