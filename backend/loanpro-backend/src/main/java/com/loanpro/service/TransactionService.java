package com.loanpro.service;

import com.loanpro.entity.Transaction;
import com.loanpro.entity.Wallet;
import com.loanpro.enums.TransactionCategory;
import com.loanpro.enums.TransactionType;
import com.loanpro.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction createTransaction(Wallet wallet, String description, BigDecimal amount, TransactionType type, TransactionCategory category) {
        Transaction transaction = Transaction.builder()
                .txnId("TXN-" + (System.currentTimeMillis() % 1000000))
                .wallet(wallet)
                .description(description)
                .amount(amount)
                .type(type)
                .category(category)
                .status("Success")
                .createdAt(LocalDateTime.now())
                .build();
                
        return transactionRepository.save(transaction);
    }
}
