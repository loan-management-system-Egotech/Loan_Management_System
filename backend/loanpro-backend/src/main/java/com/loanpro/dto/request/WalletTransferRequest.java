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
public class WalletTransferRequest {
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    @NotBlank(message = "Target is required")
    private String target; // "SAVINGS" or "EXTERNAL" or another user
    
    private Long savingGoalId;
}
