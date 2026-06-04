package com.loanpro.service;

import com.loanpro.dto.request.PaymentRequest;
import com.loanpro.dto.response.PaymentResponse;
import com.loanpro.entity.*;
import com.loanpro.enums.LoanStatus;
import com.loanpro.enums.PaymentStatus;
import com.loanpro.enums.TransactionCategory;
import com.loanpro.enums.TransactionType;
import com.loanpro.repository.LoanRepository;
import com.loanpro.repository.PaymentRepository;
import com.loanpro.repository.RepaymentScheduleRepository;
import com.loanpro.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepaymentService {

    private final RepaymentScheduleRepository scheduleRepository;
    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;
    private final WalletRepository walletRepository;
    private final UserService userService;
    private final TransactionService transactionService;

    @Transactional
    public void makePayment(String loanId, PaymentRequest request) {
        User user = userService.getCurrentUser();
        
        Loan loan = loanRepository.findByLoanId(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));
                
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            throw new IllegalArgumentException("Loan is not active");
        }
        
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));
                
        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient wallet balance for this payment");
        }

        // Find the next schedule
        RepaymentSchedule nextSchedule = scheduleRepository.findByLoanOrderByInstallmentNumberAsc(loan).stream()
                .filter(s -> s.getStatus() == PaymentStatus.NEXT_DUE || s.getStatus() == PaymentStatus.OVERDUE)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No pending EMI found for this loan"));
                
        if (request.getAmount().compareTo(nextSchedule.getEmiAmount()) != 0) {
            throw new IllegalArgumentException("Payment amount must be exactly equal to the next EMI amount: " + nextSchedule.getEmiAmount());
        }

        // Deduct from wallet
        wallet.setBalance(wallet.getBalance().subtract(request.getAmount()));
        wallet.setTotalDebited(wallet.getTotalDebited().add(request.getAmount()));
        walletRepository.save(wallet);

        // Record Transaction
        transactionService.createTransaction(wallet, "EMI Payment - " + loan.getLoanTypeName(), request.getAmount(), TransactionType.DEBIT, TransactionCategory.EMI_PAYMENT);

        // Record Payment
        Payment payment = Payment.builder()
                .txnId("TXN-" + (System.currentTimeMillis() % 1000000))
                .loan(loan)
                .user(user)
                .paymentDate(LocalDate.now())
                .totalAmount(request.getAmount())
                .principalComponent(nextSchedule.getPrincipalComponent())
                .interestComponent(nextSchedule.getInterestComponent())
                .status(PaymentStatus.PAID)
                .build();
        paymentRepository.save(payment);

        // Update schedule
        nextSchedule.setStatus(PaymentStatus.PAID);
        scheduleRepository.save(nextSchedule);
        
        // Update next schedule if available
        scheduleRepository.findByLoanOrderByInstallmentNumberAsc(loan).stream()
                .filter(s -> s.getStatus() == PaymentStatus.PENDING)
                .findFirst()
                .ifPresent(s -> {
                    s.setStatus(PaymentStatus.NEXT_DUE);
                    scheduleRepository.save(s);
                });

        // Update Loan
        loan.setAmountPaid(loan.getAmountPaid().add(request.getAmount()));
        if (loan.getAmountPaid().compareTo(loan.getTotalPayable()) >= 0) {
            loan.setStatus(LoanStatus.COMPLETED);
        }
        loanRepository.save(loan);
    }

    public List<PaymentResponse> getMyPaymentHistory() {
        User user = userService.getCurrentUser();
        return paymentRepository.findByUserOrderByPaymentDateDesc(user).stream()
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
}
