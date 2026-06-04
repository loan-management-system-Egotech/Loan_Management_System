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
public class RepaymentScheduleResponse {
    private Integer month;
    private String date;
    private BigDecimal emi;
    private BigDecimal principal;
    private BigDecimal interest;
    private BigDecimal balance;
    private String status;
}
