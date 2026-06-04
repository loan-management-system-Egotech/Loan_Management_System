package com.loanpro.repository;

import com.loanpro.entity.Loan;
import com.loanpro.entity.RepaymentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepaymentScheduleRepository extends JpaRepository<RepaymentSchedule, Long> {
    List<RepaymentSchedule> findByLoanOrderByInstallmentNumberAsc(Loan loan);
}
