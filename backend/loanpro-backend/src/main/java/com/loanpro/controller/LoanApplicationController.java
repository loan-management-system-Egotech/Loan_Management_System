package com.loanpro.controller;

import com.loanpro.dto.request.LoanApplicationRequest;
import com.loanpro.dto.request.LoanDecisionRequest;
import com.loanpro.dto.response.LoanApplicationResponse;
import com.loanpro.dto.response.LoanTypeResponse;
import com.loanpro.service.LoanApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService applicationService;

    @GetMapping("/loan-types")
    public ResponseEntity<List<LoanTypeResponse>> getLoanTypes() {
        return ResponseEntity.ok(applicationService.getAllLoanTypes());
    }

    @PostMapping("/applications")
    public ResponseEntity<LoanApplicationResponse> submitApplication(@Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.ok(applicationService.submitApplication(request));
    }

    @GetMapping("/applications/my")
    public ResponseEntity<List<LoanApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<LoanApplicationResponse> getApplication(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    // ---- Admin Endpoints ----

    @GetMapping("/admin/applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<LoanApplicationResponse>> getAllApplications(
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(applicationService.getAllApplications(status, search, PageRequest.of(page, size)));
    }

    @GetMapping("/admin/applications/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplicationResponse> getAdminApplication(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/admin/applications/{id}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanApplicationResponse> reviewApplication(
            @PathVariable String id,
            @Valid @RequestBody LoanDecisionRequest request
    ) {
        return ResponseEntity.ok(applicationService.reviewApplication(id, request));
    }
}
