package com.loanpro.repository;

import com.loanpro.entity.Loan;
import com.loanpro.entity.Payment;
import com.loanpro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLoanOrderByPaymentDateDesc(Loan loan);
    List<Payment> findByUserOrderByPaymentDateDesc(User user);
}
