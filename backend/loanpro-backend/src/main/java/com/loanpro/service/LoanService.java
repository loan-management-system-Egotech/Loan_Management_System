package com.loanpro.service;

import com.loanpro.dto.response.LoanDetailResponse;
import com.loanpro.dto.response.PaymentResponse;
import com.loanpro.dto.response.RepaymentScheduleResponse;
import com.loanpro.entity.Loan;
import com.loanpro.entity.LoanApplication;
import com.loanpro.entity.RepaymentSchedule;
import com.loanpro.entity.User;
import com.loanpro.enums.LoanStatus;
import com.loanpro.enums.PaymentStatus;
import com.loanpro.repository.LoanRepository;
import com.loanpro.repository.PaymentRepository;
import com.loanpro.repository.RepaymentScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final RepaymentScheduleRepository scheduleRepository;
    private final PaymentRepository paymentRepository;
    private final EmiCalculationService emiService;
    private final UserService userService;

    @Transactional
    public void createLoanFromApplication(LoanApplication application) {
        BigDecimal principal = application.getApprovedAmount();
        BigDecimal annualRate = application.getInterestRate();
        int tenure = application.getApprovedTenure();
        
        BigDecimal emi = emiService.calculateEmi(principal, annualRate, tenure);
        BigDecimal totalPayable = emi.multiply(new BigDecimal(tenure)).setScale(2, RoundingMode.HALF_UP);

        Loan loan = Loan.builder()
                .loanId("LN-" + (System.currentTimeMillis() % 100000))
                .user(application.getUser())
                .application(application)
                .loanTypeName(application.getLoanType().getName().toUpperCase().replace(" LOAN", ""))
                .principalAmount(principal)
                .totalPayable(totalPayable)
                .amountPaid(BigDecimal.ZERO)
                .interestRate(annualRate)
                .tenureMonths(tenure)
                .emiAmount(emi)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(tenure))
                .status(LoanStatus.ACTIVE)
                .build();

        loan = loanRepository.save(loan);

        List<RepaymentSchedule> schedules = emiService.generateAmortizationSchedule(principal, annualRate, tenure, LocalDate.now());
        for (RepaymentSchedule s : schedules) {
            s.setLoan(loan);
        }
        scheduleRepository.saveAll(schedules);
    }

    public List<LoanDetailResponse> getActiveLoans() {
        User user = userService.getCurrentUser();
        return loanRepository.findByUserAndStatus(user, LoanStatus.ACTIVE).stream()
                .map(this::mapToLoanDetailResponse)
                .collect(Collectors.toList());
    }

    public LoanDetailResponse getLoanById(String loanId) {
        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        return mapToLoanDetailResponse(loan);
    }

    public List<RepaymentScheduleResponse> getRepaymentSchedule(String loanId) {
        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        return scheduleRepository.findByLoanOrderByInstallmentNumberAsc(loan).stream()
                .map(this::mapToScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getLoanPayments(String loanId) {
        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        return paymentRepository.findByLoanOrderByPaymentDateDesc(loan).stream()
                .map(payment -> PaymentResponse.builder()
                        .txnId(payment.getTxnId())
                        .date(payment.getPaymentDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                        .amount(payment.getTotalAmount())
                        .principal(payment.getPrincipalComponent())
                        .interest(payment.getInterestComponent())
                        .status(payment.getStatus().name())
                        .build())
                .collect(Collectors.toList());
    }

    private LoanDetailResponse mapToLoanDetailResponse(Loan loan) {
        BigDecimal paidPercentage = BigDecimal.ZERO;
        if (loan.getTotalPayable().compareTo(BigDecimal.ZERO) > 0) {
            paidPercentage = loan.getAmountPaid()
                    .divide(loan.getTotalPayable(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        LoanDetailResponse.NextEmiDto nextEmiDto = null;
        if (loan.getStatus() == LoanStatus.ACTIVE) {
            RepaymentSchedule nextSchedule = scheduleRepository.findByLoanOrderByInstallmentNumberAsc(loan).stream()
                    .filter(s -> s.getStatus() == PaymentStatus.NEXT_DUE || s.getStatus() == PaymentStatus.OVERDUE)
                    .findFirst()
                    .orElse(null);

            if (nextSchedule != null) {
                long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), nextSchedule.getDueDate());
                nextEmiDto = LoanDetailResponse.NextEmiDto.builder()
                        .amount(nextSchedule.getEmiAmount())
                        .dueDate(nextSchedule.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                        .daysLeft((int) daysLeft)
                        .build();
            }
        }

        return LoanDetailResponse.builder()
                .id(loan.getLoanId())
                .type(loan.getLoanTypeName() + " Loan")
                .status(loan.getStatus().name())
                .principal(loan.getPrincipalAmount())
                .totalPayable(loan.getTotalPayable())
                .amountPaid(loan.getAmountPaid())
                .paidPercentage(paidPercentage.intValue())
                .interestRate(loan.getInterestRate() + "%")
                .tenure(loan.getTenureMonths() + " Months")
                .startDate(loan.getStartDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .nextEmi(nextEmiDto)
                .build();
    }

    private RepaymentScheduleResponse mapToScheduleResponse(RepaymentSchedule schedule) {
        return RepaymentScheduleResponse.builder()
                .month(schedule.getInstallmentNumber())
                .date(schedule.getDueDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .emi(schedule.getEmiAmount())
                .principal(schedule.getPrincipalComponent())
                .interest(schedule.getInterestComponent())
                .balance(schedule.getRemainingBalance())
                .status(schedule.getStatus().name())
                .build();
    }
}
