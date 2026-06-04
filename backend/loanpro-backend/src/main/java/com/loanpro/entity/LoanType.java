package com.loanpro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * LoanType entity — the product catalog (Personal, Business, Home, Vehicle loans).
 * Seeded via data.sql on startup.
 */
@Entity
@Table(name = "loan_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Display name, e.g. "Personal Loan".
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Unique short code used in API calls, e.g. "personal", "business".
     */
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "max_limit", nullable = false, precision = 15, scale = 2)
    private BigDecimal maxLimit;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_interest_rate", precision = 5, scale = 2)
    private BigDecimal minInterestRate;

    @Column(name = "max_interest_rate", precision = 5, scale = 2)
    private BigDecimal maxInterestRate;

    @Column(name = "active")
    @Builder.Default
    private Boolean active = true;
}
