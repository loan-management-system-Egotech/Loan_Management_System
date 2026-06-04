package com.loanpro.service;

import com.loanpro.entity.RepaymentSchedule;
import com.loanpro.enums.PaymentStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmiCalculationService {

    public BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        if (annualRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(new BigDecimal(tenureMonths), 2, RoundingMode.HALF_UP);
        }

        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("1200"), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusRPowerN = BigDecimal.ONE.add(monthlyRate).pow(tenureMonths);

        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusRPowerN);
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    public List<RepaymentSchedule> generateAmortizationSchedule(BigDecimal principal, BigDecimal annualRate, int tenureMonths, LocalDate startDate) {
        List<RepaymentSchedule> schedule = new ArrayList<>();
        BigDecimal emi = calculateEmi(principal, annualRate, tenureMonths);
        BigDecimal monthlyRate = annualRate.divide(new BigDecimal("1200"), 10, RoundingMode.HALF_UP);

        BigDecimal remainingBalance = principal;
        LocalDate dueDate = startDate;

        for (int i = 1; i <= tenureMonths; i++) {
            dueDate = dueDate.plusMonths(1);

            BigDecimal interestComponent = remainingBalance.multiply(monthlyRate).setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalComponent = emi.subtract(interestComponent).setScale(2, RoundingMode.HALF_UP);

            // Handle the last installment rounding difference
            if (i == tenureMonths) {
                principalComponent = remainingBalance;
                emi = principalComponent.add(interestComponent).setScale(2, RoundingMode.HALF_UP);
                remainingBalance = BigDecimal.ZERO;
            } else {
                remainingBalance = remainingBalance.subtract(principalComponent).setScale(2, RoundingMode.HALF_UP);
            }

            RepaymentSchedule installment = RepaymentSchedule.builder()
                    .installmentNumber(i)
                    .dueDate(dueDate)
                    .emiAmount(emi)
                    .principalComponent(principalComponent)
                    .interestComponent(interestComponent)
                    .remainingBalance(remainingBalance)
                    .status(i == 1 ? PaymentStatus.NEXT_DUE : PaymentStatus.PENDING)
                    .build();

            schedule.add(installment);
        }

        return schedule;
    }
}
