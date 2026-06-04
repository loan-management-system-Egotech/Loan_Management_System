package com.loanpro.entity;

import com.loanpro.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * LoanApplication entity — stores all data collected across the 5-step application form.
 * Contains personal info, employment info, financial info, and review/decision data.
 */
@Entity
@Table(name = "loan_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Human-readable application ID, e.g. "APP-0234".
     */
    @Column(name = "application_id", nullable = false, unique = true)
    private String applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "loan_type_id", nullable = false)
    private LoanType loanType;

    // ---- Loan Request ----

    @Column(name = "amount_requested", nullable = false, precision = 15, scale = 2)
    private BigDecimal amountRequested;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // ---- Personal Information (Step 2) ----

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "email")
    private String email;

    @Column(name = "nic")
    private String nic;

    @Column(name = "gender")
    private String gender;

    @Column(name = "marital_status")
    private String maritalStatus;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "phone")
    private String phone;

    // ---- Employment Information (Step 3) ----

    @Column(name = "emp_status")
    private String empStatus;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "work_address", columnDefinition = "TEXT")
    private String workAddress;

    @Column(name = "emp_name")
    private String empName;

    @Column(name = "years_employed")
    private Integer yearsEmployed;

    @Column(name = "work_phone")
    private String workPhone;

    // ---- Financial Information (Step 3) ----

    @Column(name = "gross_salary", precision = 15, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "net_salary", precision = 15, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "existing_emis", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal existingEmis = BigDecimal.ZERO;

    @Column(name = "credit_card_payments", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal creditCardPayments = BigDecimal.ZERO;

    // ---- Credit & Risk ----

    @Column(name = "credit_score")
    private Integer creditScore;

    // ---- Admin Decision ----

    @Column(name = "approved_amount", precision = 15, scale = 2)
    private BigDecimal approvedAmount;

    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "approved_tenure")
    private Integer approvedTenure;

    @Column(name = "admin_remarks", columnDefinition = "TEXT")
    private String adminRemarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        submittedAt = LocalDateTime.now();
    }
}
