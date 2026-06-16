package com.loanpro.service;

import com.loanpro.dto.request.SavingGoalRequest;
import com.loanpro.dto.request.WalletTopUpRequest;
import com.loanpro.dto.request.WalletTransferRequest;
import com.loanpro.dto.response.SavingGoalResponse;
import com.loanpro.dto.response.TransactionResponse;
import com.loanpro.dto.response.WalletResponse;
import com.loanpro.entity.SavingGoal;
import com.loanpro.entity.Transaction;
import com.loanpro.entity.User;
import com.loanpro.entity.Wallet;
import com.loanpro.enums.TransactionCategory;
import com.loanpro.enums.TransactionType;
import com.loanpro.repository.SavingGoalRepository;
import com.loanpro.repository.TransactionRepository;
import com.loanpro.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final SavingGoalRepository savingGoalRepository;
    private final TransactionService transactionService;
    private final UserService userService;

    public WalletResponse getWalletSummary() {
        User user = userService.getCurrentUser();
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        BigDecimal saved = savingGoalRepository.findByUser(user).stream()
                .map(SavingGoal::getCurrentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return WalletResponse.builder()
                .balance(wallet.getBalance())
                .walletId(wallet.getWalletId())
                .totalCredited(wallet.getTotalCredited())
                .totalDebited(wallet.getTotalDebited())
                .pending(BigDecimal.ZERO)
                .saved(saved)
                .build();
    }

    @Transactional
    public void topUp(WalletTopUpRequest request) {
        User user = userService.getCurrentUser();
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        wallet.setTotalCredited(wallet.getTotalCredited().add(request.getAmount()));
        walletRepository.save(wallet);

        transactionService.createTransaction(wallet, "Wallet Top-up", request.getAmount(), TransactionType.CREDIT, TransactionCategory.TOP_UP);
    }

    @Transactional
    public void transfer(WalletTransferRequest request) {
        User user = userService.getCurrentUser();
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        wallet.setBalance(wallet.getBalance().subtract(request.getAmount()));
        wallet.setTotalDebited(wallet.getTotalDebited().add(request.getAmount()));
        walletRepository.save(wallet);

        if ("SAVINGS".equalsIgnoreCase(request.getTarget()) && request.getSavingGoalId() != null) {
            SavingGoal goal = savingGoalRepository.findById(request.getSavingGoalId())
                    .orElseThrow(() -> new IllegalArgumentException("Saving goal not found"));
            goal.setCurrentAmount(goal.getCurrentAmount().add(request.getAmount()));
            savingGoalRepository.save(goal);
            transactionService.createTransaction(wallet, "Transfer to Savings", request.getAmount(), TransactionType.DEBIT, TransactionCategory.TRANSFER);
        } else {
            transactionService.createTransaction(wallet, "External Transfer", request.getAmount(), TransactionType.DEBIT, TransactionCategory.TRANSFER);
        }
    }

    @Transactional
    public void withdraw(WalletTopUpRequest request) {
        User user = userService.getCurrentUser();
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        if (wallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        wallet.setBalance(wallet.getBalance().subtract(request.getAmount()));
        wallet.setTotalDebited(wallet.getTotalDebited().add(request.getAmount()));
        walletRepository.save(wallet);

        transactionService.createTransaction(wallet, "Withdrawal", request.getAmount(), TransactionType.DEBIT, TransactionCategory.WITHDRAWAL);
    }

    public List<TransactionResponse> getTransactions() {
        User user = userService.getCurrentUser();
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        return transactionRepository.findTop10ByWalletOrderByCreatedAtDesc(wallet).stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getSpendingBreakdown() {
        User user = userService.getCurrentUser();
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        List<Transaction> debits = transactionRepository.findByWalletAndType(wallet, TransactionType.DEBIT);
        
        BigDecimal emiTotal = debits.stream()
                .filter(t -> TransactionCategory.EMI_PAYMENT == t.getCategory())
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal transferTotal = debits.stream()
                .filter(t -> TransactionCategory.TRANSFER == t.getCategory())
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal withdrawTotal = debits.stream()
                .filter(t -> TransactionCategory.WITHDRAWAL == t.getCategory())
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("emi", emiTotal);
        breakdown.put("transfers", transferTotal);
        breakdown.put("withdrawals", withdrawTotal);
        return breakdown;
    }

    public List<SavingGoalResponse> getSavingGoals() {
        return savingGoalRepository.findByUser(userService.getCurrentUser()).stream()
                .map(this::mapToSavingGoalResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavingGoalResponse createSavingGoal(SavingGoalRequest request) {
        SavingGoal goal = SavingGoal.builder()
                .user(userService.getCurrentUser())
                .label(request.getLabel())
                .currentAmount(BigDecimal.ZERO)
                .targetAmount(request.getTargetAmount())
                .color(request.getColor() != null ? request.getColor() : "#3b82f6")
                .createdAt(LocalDateTime.now())
                .build();
        return mapToSavingGoalResponse(savingGoalRepository.save(goal));
    }

    private SavingGoalResponse mapToSavingGoalResponse(SavingGoal goal) {
        return SavingGoalResponse.builder()
                .id(goal.getId())
                .label(goal.getLabel())
                .currentAmount(goal.getCurrentAmount())
                .targetAmount(goal.getTargetAmount())
                .color(goal.getColor())
                .progressPercentage(goal.getProgressPercentage())
                .build();
    }

    private TransactionResponse mapToTransactionResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getTxnId())
                .description(t.getDescription())
                .type(t.getCategory().name())
                .amount(t.getType() == TransactionType.DEBIT ? t.getAmount().negate() : t.getAmount())
                .status(t.getStatus())
                .isCredit(t.getType() == TransactionType.CREDIT)
                .createdAt(t.getCreatedAt() != null ? t.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "")
                .build();
    }
}
