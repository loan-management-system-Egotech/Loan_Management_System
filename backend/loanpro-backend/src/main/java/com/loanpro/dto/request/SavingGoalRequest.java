package com.loanpro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SavingGoalRequest {
    
    @NotBlank(message = "Label is required")
    private String label;
    
    @NotNull(message = "Target amount is required")
    private BigDecimal targetAmount;
    
    private String color;
}
