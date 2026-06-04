package com.loanpro.repository;

import com.loanpro.entity.Transaction;
import com.loanpro.entity.Wallet;
import com.loanpro.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTop10ByWalletOrderByCreatedAtDesc(Wallet wallet);
    List<Transaction> findByWalletAndType(Wallet wallet, TransactionType type);
}
