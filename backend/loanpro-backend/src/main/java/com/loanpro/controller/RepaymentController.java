package com.loanpro.controller;

import com.loanpro.dto.request.PaymentRequest;
import com.loanpro.dto.response.PaymentResponse;
import com.loanpro.service.RepaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RepaymentController {

    private final RepaymentService repaymentService;

    @PostMapping("/loans/{id}/pay")
    public ResponseEntity<Void> makePayment(
            @PathVariable String id,
            @Valid @RequestBody PaymentRequest request
    ) {
        repaymentService.makePayment(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/payments/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {
        return ResponseEntity.ok(repaymentService.getMyPaymentHistory());
    }
}
