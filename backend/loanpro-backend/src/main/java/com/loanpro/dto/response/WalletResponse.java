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
public class WalletResponse {
    private BigDecimal balance;
    private String walletId;
    private BigDecimal totalCredited;
    private BigDecimal totalDebited;
    private BigDecimal pending;
    private BigDecimal saved;
}
