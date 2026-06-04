package com.loanpro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoanApplicationRequest {
    
    @NotBlank(message = "Loan type is required")
    private String loanType;

    @NotNull(message = "Amount requested is required")
    private BigDecimal amountRequested;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotNull(message = "Tenure is required")
    private Integer tenureMonths;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    private String address;
    private String city;
    private String email;
    private String nic;
    private String gender;
    private String maritalStatus;
    private String postalCode;
    private String phone;
    
    private String empStatus;
    private String jobTitle;
    private String workAddress;
    private String empName;
    private Integer yearsEmp;
    private String workPhone;
    
    @NotNull(message = "Gross salary is required")
    private BigDecimal grossSalary;
    
    private BigDecimal netSalary;
    private BigDecimal existingEmis;
    private BigDecimal creditCard;
}
