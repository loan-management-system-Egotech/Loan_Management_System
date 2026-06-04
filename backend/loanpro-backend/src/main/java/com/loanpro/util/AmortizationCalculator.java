package com.loanpro.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class AmortizationCalculator {

    public static BigDecimal calculateDtiRatio(BigDecimal grossSalary, BigDecimal existingEmis, BigDecimal creditCardPayments, BigDecimal newEmi) {
        if (grossSalary == null || grossSalary.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal totalDebt = (existingEmis != null ? existingEmis : BigDecimal.ZERO)
                .add(creditCardPayments != null ? creditCardPayments : BigDecimal.ZERO)
                .add(newEmi != null ? newEmi : BigDecimal.ZERO);
                
        return totalDebt.divide(grossSalary, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public static int assessRisk(int creditScore, BigDecimal dtiRatio, int yearsEmployed, String incomeStability) {
        int score = 0;
        
        // Credit score logic
        if (creditScore >= 750) score += 40;
        else if (creditScore >= 700) score += 30;
        else if (creditScore >= 650) score += 20;
        else if (creditScore >= 600) score += 10;
        
        // DTI logic
        if (dtiRatio.compareTo(new BigDecimal("20")) <= 0) score += 30;
        else if (dtiRatio.compareTo(new BigDecimal("35")) <= 0) score += 20;
        else if (dtiRatio.compareTo(new BigDecimal("50")) <= 0) score += 10;
        
        // Employment logic
        if (yearsEmployed >= 5) score += 20;
        else if (yearsEmployed >= 2) score += 10;
        else if (yearsEmployed >= 1) score += 5;
        
        // Income stability
        if ("High".equalsIgnoreCase(incomeStability)) score += 10;
        else if ("Medium".equalsIgnoreCase(incomeStability)) score += 5;
        
        return score;
    }
}
