package com.loanpro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Response DTO for a saving goal. Exposes only the fields the frontend needs —
 * the owning {@code User} is deliberately omitted so the lazy association is
 * never serialized (which would leak the user's password hash and other fields).
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SavingGoalResponse {
    private Long id;
    private String label;
    private BigDecimal currentAmount;
    private BigDecimal targetAmount;
    private String color;
    private int progressPercentage;
}
