package com.loanpro.controller;

import com.loanpro.dto.response.LoanDetailResponse;
import com.loanpro.dto.response.PaymentResponse;
import com.loanpro.dto.response.RepaymentScheduleResponse;
import com.loanpro.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @GetMapping("/active")
    public ResponseEntity<LoanDetailResponse> getActiveLoan() {
        List<LoanDetailResponse> loans = loanService.getActiveLoans();
        if (loans.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(loans.get(0)); // Return first active loan per mock data approach
    }
    
    @GetMapping("/active/all")
    public ResponseEntity<List<LoanDetailResponse>> getAllActiveLoans() {
        return ResponseEntity.ok(loanService.getActiveLoans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanDetailResponse> getLoanDetails(@PathVariable String id) {
        return ResponseEntity.ok(loanService.getLoanById(id));
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<RepaymentScheduleResponse>> getRepaymentSchedule(@PathVariable String id) {
        return ResponseEntity.ok(loanService.getRepaymentSchedule(id));
    }

    @GetMapping("/{id}/payments")
    public ResponseEntity<List<PaymentResponse>> getLoanPayments(@PathVariable String id) {
        return ResponseEntity.ok(loanService.getLoanPayments(id));
    }
}
