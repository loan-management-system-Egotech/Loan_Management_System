package com.loanpro.service;

import com.loanpro.dto.response.AdminStatsResponse;
import com.loanpro.dto.response.LoanApplicationResponse;
import com.loanpro.dto.response.UserProfileResponse;
import com.loanpro.entity.Loan;
import com.loanpro.entity.LoanApplication;
import com.loanpro.entity.User;
import com.loanpro.enums.ApplicationStatus;
import com.loanpro.enums.LoanStatus;
import com.loanpro.repository.LoanApplicationRepository;
import com.loanpro.repository.LoanRepository;
import com.loanpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final LoanRepository loanRepository;
    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public List<AdminStatsResponse> getStats() {
        List<AdminStatsResponse> stats = new ArrayList<>();
        
        long activeLoans = loanRepository.countByStatus(LoanStatus.ACTIVE);
        stats.add(AdminStatsResponse.builder()
                .title("Active Loans")
                .value(String.valueOf(activeLoans))
                .trend("+8% this month")
                .type("positive")
                .build());

        BigDecimal totalDisbursed = loanRepository.findAll().stream()
                .map(Loan::getPrincipalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.add(AdminStatsResponse.builder()
                .title("Total Disbursed")
                .value("LKR " + (totalDisbursed.divide(new BigDecimal("1000000"))).intValue() + "M")
                .trend("+18% YTD")
                .type("positive")
                .build());

        long pendingReview = applicationRepository.countByStatus(ApplicationStatus.PENDING);
        stats.add(AdminStatsResponse.builder()
                .title("Pending Review")
                .value(String.valueOf(pendingReview))
                .trend("Needs Attention")
                .type("warning")
                .build());

        long totalLoans = loanRepository.count();
        long defaultedLoans = loanRepository.countByStatus(LoanStatus.DEFAULTED);
        double defaultRate = totalLoans > 0 ? ((double) defaultedLoans / totalLoans) * 100 : 0.0;
        stats.add(AdminStatsResponse.builder()
                .title("Default Rate")
                .value(String.format("%.1f%%", defaultRate))
                .trend("-0.2% improved")
                .type("positive")
                .build());

        return stats;
    }

    public Map<String, Object> getChartsData() {
        // Simplified chart data
        Map<String, Object> data = new HashMap<>();
        data.put("months", List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun"));
        data.put("disbursements", List.of(120, 150, 180, 200, 170, 220));
        data.put("collections", List.of(100, 130, 160, 180, 150, 200));
        return data;
    }

    public Page<UserProfileResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(user -> UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build());
    }
    
    @Transactional
    public void updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(com.loanpro.enums.Role.valueOf(role));
        userRepository.save(user);
    }
}
