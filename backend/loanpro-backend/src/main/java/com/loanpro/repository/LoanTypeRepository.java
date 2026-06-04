package com.loanpro.repository;

import com.loanpro.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for LoanType entity (product catalog).
 */
@Repository
public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {

    Optional<LoanType> findByCode(String code);

    List<LoanType> findByActiveTrue();

    boolean existsByCode(String code);
}
