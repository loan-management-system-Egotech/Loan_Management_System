package com.loanpro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private String id;
    private String description;
    private String type; // e.g. "Personal"
    private BigDecimal amount;
    private String status;
    private Boolean isCredit;
    private String createdAt;
}
