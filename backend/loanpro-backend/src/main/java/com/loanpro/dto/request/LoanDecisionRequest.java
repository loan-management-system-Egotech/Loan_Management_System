package com.loanpro.dto.request;

import com.loanpro.enums.ApplicationStatus;
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
public class LoanDecisionRequest {
    
    @NotNull(message = "Decision is required")
    private ApplicationStatus decision;
    
    private BigDecimal approvedAmount;
    private BigDecimal interestRate;
    private Integer tenure;
    private String remarks;
}
