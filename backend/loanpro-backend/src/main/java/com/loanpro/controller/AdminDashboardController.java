package com.loanpro.controller;

import com.loanpro.dto.response.AdminStatsResponse;
import com.loanpro.dto.response.UserProfileResponse;
import com.loanpro.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<List<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(adminDashboardService.getStats());
    }

    @GetMapping("/dashboard/charts")
    public ResponseEntity<Map<String, Object>> getCharts() {
        return ResponseEntity.ok(adminDashboardService.getChartsData());
    }

    @GetMapping("/dashboard/system")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(adminDashboardService.getSystemHealth());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserProfileResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminDashboardService.getAllUsers(PageRequest.of(page, size)));
    }
    
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        adminDashboardService.updateUserRole(id, role);
        return ResponseEntity.ok().build();
    }
}
