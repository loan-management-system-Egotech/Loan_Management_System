package com.loanpro.controller;

import com.loanpro.dto.request.SavingGoalRequest;
import com.loanpro.dto.request.WalletTopUpRequest;
import com.loanpro.dto.request.WalletTransferRequest;
import com.loanpro.dto.response.SavingGoalResponse;
import com.loanpro.dto.response.TransactionResponse;
import com.loanpro.dto.response.WalletResponse;
import com.loanpro.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletResponse> getWalletSummary() {
        return ResponseEntity.ok(walletService.getWalletSummary());
    }

    @PostMapping("/topup")
    public ResponseEntity<Void> topUp(@Valid @RequestBody WalletTopUpRequest request) {
        walletService.topUp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(@Valid @RequestBody WalletTransferRequest request) {
        walletService.transfer(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Void> withdraw(@Valid @RequestBody WalletTopUpRequest request) {
        walletService.withdraw(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions() {
        return ResponseEntity.ok(walletService.getTransactions());
    }

    @GetMapping("/spending-breakdown")
    public ResponseEntity<Map<String, Object>> getSpendingBreakdown() {
        return ResponseEntity.ok(walletService.getSpendingBreakdown());
    }

    @GetMapping("/saving-goals")
    public ResponseEntity<List<SavingGoalResponse>> getSavingGoals() {
        return ResponseEntity.ok(walletService.getSavingGoals());
    }

    @PostMapping("/saving-goals")
    public ResponseEntity<SavingGoalResponse> createSavingGoal(@Valid @RequestBody SavingGoalRequest request) {
        return ResponseEntity.ok(walletService.createSavingGoal(request));
    }
}
