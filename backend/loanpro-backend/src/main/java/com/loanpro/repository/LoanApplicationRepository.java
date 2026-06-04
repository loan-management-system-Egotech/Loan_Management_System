package com.loanpro.repository;

import com.loanpro.entity.LoanApplication;
import com.loanpro.entity.User;
import com.loanpro.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    Optional<LoanApplication> findByApplicationId(String applicationId);
    List<LoanApplication> findByUser(User user);
    Page<LoanApplication> findByStatus(ApplicationStatus status, Pageable pageable);
    long countByStatus(ApplicationStatus status);
}
