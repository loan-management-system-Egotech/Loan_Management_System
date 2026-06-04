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
public class LoanDetailResponse {
    private String id;
    private String type;
    private String status;
    private BigDecimal principal;
    private BigDecimal totalPayable;
    private BigDecimal amountPaid;
    private Integer paidPercentage;
    private String interestRate;
    private String tenure;
    private String startDate;
    private NextEmiDto nextEmi;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NextEmiDto {
        private BigDecimal amount;
        private String dueDate;
        private Integer daysLeft;
    }
}
