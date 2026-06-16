package com.loanpro.service;

import com.loanpro.dto.response.AdminStatsResponse;
import com.loanpro.dto.response.LoanApplicationResponse;
import com.loanpro.dto.response.UserProfileResponse;
import com.loanpro.entity.Loan;
import com.loanpro.entity.LoanApplication;
import com.loanpro.entity.User;
import com.loanpro.enums.ApplicationStatus;
import com.loanpro.enums.LoanStatus;
import com.loanpro.entity.Payment;
import com.loanpro.repository.LoanApplicationRepository;
import com.loanpro.repository.LoanRepository;
import com.loanpro.repository.PaymentRepository;
import com.loanpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final LoanRepository loanRepository;
    private final LoanApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

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
        Map<String, Object> data = new HashMap<>();

        // Last 6 months (oldest first), including the current month.
        List<YearMonth> window = new ArrayList<>();
        YearMonth current = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            window.add(current.minusMonths(i));
        }

        // Disbursements per month: sum of loan principals, bucketed by start date.
        Map<YearMonth, BigDecimal> disbursedByMonth = new HashMap<>();
        for (Loan loan : loanRepository.findAll()) {
            if (loan.getStartDate() == null) continue;
            YearMonth ym = YearMonth.from(loan.getStartDate());
            disbursedByMonth.merge(ym, loan.getPrincipalAmount(), BigDecimal::add);
        }

        // Collections per month: sum of payment totals, bucketed by payment date.
        Map<YearMonth, BigDecimal> collectedByMonth = new HashMap<>();
        for (Payment payment : paymentRepository.findAll()) {
            if (payment.getPaymentDate() == null) continue;
            YearMonth ym = YearMonth.from(payment.getPaymentDate());
            collectedByMonth.merge(ym, payment.getTotalAmount(), BigDecimal::add);
        }

        List<String> months = new ArrayList<>();
        List<BigDecimal> disbursements = new ArrayList<>();
        List<BigDecimal> collections = new ArrayList<>();
        for (YearMonth ym : window) {
            months.add(ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            disbursements.add(disbursedByMonth.getOrDefault(ym, BigDecimal.ZERO));
            collections.add(collectedByMonth.getOrDefault(ym, BigDecimal.ZERO));
        }
        data.put("months", months);
        data.put("disbursements", disbursements);
        data.put("collections", collections);

        // Real loan portfolio mix: active loans grouped by loan type
        Map<String, Long> portfolio = loanRepository.findAll().stream()
                .filter(loan -> loan.getStatus() == LoanStatus.ACTIVE)
                .collect(Collectors.groupingBy(Loan::getLoanTypeName, Collectors.counting()));
        data.put("portfolio", portfolio);

        return data;
    }

    /**
     * Real operational metrics for the admin "System Health" panel, derived from
     * the database and the JVM runtime (no fabricated infrastructure numbers).
     */
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("totalUsers", userRepository.count());
        health.put("activeLoans", loanRepository.countByStatus(LoanStatus.ACTIVE));
        health.put("pendingApplications", applicationRepository.countByStatus(ApplicationStatus.PENDING));
        health.put("uptime", formatUptime(ManagementFactory.getRuntimeMXBean().getUptime()));
        return health;
    }

    private String formatUptime(long uptimeMs) {
        long totalMinutes = uptimeMs / 60000;
        long days = totalMinutes / (60 * 24);
        long hours = (totalMinutes / 60) % 24;
        long minutes = totalMinutes % 60;
        if (days > 0) return days + "d " + hours + "h";
        if (hours > 0) return hours + "h " + minutes + "m";
        return minutes + "m";
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
