package com.loanpro.repository;

import com.loanpro.entity.Loan;
import com.loanpro.entity.User;
import com.loanpro.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {
    Optional<Loan> findByLoanId(String loanId);
    List<Loan> findByUserAndStatus(User user, LoanStatus status);
    long countByStatus(LoanStatus status);
}
