package com.loanpro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Wallet entity — one wallet per user, auto-created on registration.
 * Tracks the user's available balance, total credits, and total debits.
 */
@Entity
@Table(name = "wallets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /**
     * Human-readable wallet identifier, e.g. "WLT-2024-ADS".
     * Generated on wallet creation.
     */
    @Column(name = "wallet_id", nullable = false, unique = true)
    private String walletId;

    @Column(name = "balance", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "total_credited", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalCredited = BigDecimal.ZERO;

    @Column(name = "total_debited", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalDebited = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
