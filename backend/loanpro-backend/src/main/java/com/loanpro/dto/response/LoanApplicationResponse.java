package com.loanpro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoanApplicationResponse {
    private String id;
    private String name;
    private String date; // Formatted date e.g. "Oct 12, 2024"
    private String type; // e.g. "Personal Loan"
    private String amount; // Formatted amount e.g. "LKR 80,000"
    private String status; // "Pending", "Approved", "Rejected"
    
    // For detailed view:
    private BigDecimal amountRequested;
    private Integer tenureMonths;
    private String purpose;
    private String email;
    private String phone;
    private String nic;
    private BigDecimal grossSalary;
    private Integer creditScore;
    private BigDecimal approvedAmount;
    private BigDecimal interestRate;
    private Integer approvedTenure;
    private String adminRemarks;
    private LocalDateTime submittedAt;
}
