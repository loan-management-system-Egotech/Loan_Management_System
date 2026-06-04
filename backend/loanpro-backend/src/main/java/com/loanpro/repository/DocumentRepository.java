package com.loanpro.repository;

import com.loanpro.entity.Document;
import com.loanpro.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByApplication(LoanApplication application);
}
