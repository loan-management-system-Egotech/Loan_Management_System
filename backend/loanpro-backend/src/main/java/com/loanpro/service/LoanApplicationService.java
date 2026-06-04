package com.loanpro.service;

import com.loanpro.dto.request.LoanApplicationRequest;
import com.loanpro.dto.request.LoanDecisionRequest;
import com.loanpro.dto.response.LoanApplicationResponse;
import com.loanpro.dto.response.LoanTypeResponse;
import com.loanpro.entity.LoanApplication;
import com.loanpro.entity.LoanType;
import com.loanpro.entity.User;
import com.loanpro.enums.ApplicationStatus;
import com.loanpro.repository.LoanApplicationRepository;
import com.loanpro.repository.LoanTypeRepository;
import com.loanpro.util.AmortizationCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanTypeRepository loanTypeRepository;
    private final UserService userService;
    private final LoanService loanService;
    private final EmiCalculationService emiCalculationService;

    public List<LoanTypeResponse> getAllLoanTypes() {
        return loanTypeRepository.findAll().stream()
                .filter(type -> type.getActive() != null && type.getActive())
                .map(type -> LoanTypeResponse.builder()
                        .id(type.getCode())
                        .title(type.getName())
                        .limit("Up to LKR " + String.format("%,.0f", type.getMaxLimit()))
                        .description(type.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public LoanApplicationResponse submitApplication(LoanApplicationRequest request) {
        User user = userService.getCurrentUser();
        LoanType loanType = loanTypeRepository.findByCode(request.getLoanType())
                .orElseThrow(() -> new IllegalArgumentException("Invalid loan type code"));

        BigDecimal estimatedEmi = emiCalculationService.calculateEmi(
                request.getAmountRequested(),
                loanType.getMinInterestRate(),
                request.getTenureMonths()
        );

        BigDecimal dtiRatio = AmortizationCalculator.calculateDtiRatio(
                request.getGrossSalary(),
                request.getExistingEmis(),
                request.getCreditCard(),
                estimatedEmi
        );

        int creditScore = AmortizationCalculator.assessRisk(
                700,
                dtiRatio,
                request.getYearsEmp() != null ? request.getYearsEmp() : 0,
                "Medium"
        );

        LoanApplication application = LoanApplication.builder()
                .applicationId("APP-" + (System.currentTimeMillis() % 10000))
                .user(user)
                .loanType(loanType)
                .amountRequested(request.getAmountRequested())
                .purpose(request.getPurpose())
                .tenureMonths(request.getTenureMonths())
                .status(ApplicationStatus.PENDING)
                .fullName(request.getFullName())
                .dateOfBirth(request.getDob())
                .address(request.getAddress())
                .city(request.getCity())
                .email(request.getEmail())
                .nic(request.getNic())
                .gender(request.getGender())
                .maritalStatus(request.getMaritalStatus())
                .postalCode(request.getPostalCode())
                .phone(request.getPhone())
                .empStatus(request.getEmpStatus())
                .jobTitle(request.getJobTitle())
                .workAddress(request.getWorkAddress())
                .empName(request.getEmpName())
                .yearsEmployed(request.getYearsEmp())
                .workPhone(request.getWorkPhone())
                .grossSalary(request.getGrossSalary())
                .netSalary(request.getNetSalary())
                .existingEmis(request.getExistingEmis())
                .creditCardPayments(request.getCreditCard())
                .creditScore(creditScore)
                .submittedAt(LocalDateTime.now())
                .build();

        application = loanApplicationRepository.save(application);
        return mapToResponse(application);
    }

    public List<LoanApplicationResponse> getMyApplications() {
        User user = userService.getCurrentUser();
        return loanApplicationRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LoanApplicationResponse getApplicationById(String appId) {
        LoanApplication app = loanApplicationRepository.findByApplicationId(appId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
        return mapToResponse(app);
    }

    public Page<LoanApplicationResponse> getAllApplications(String status, String search, Pageable pageable) {
        Page<LoanApplication> applications;
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            applications = loanApplicationRepository.findByStatus(ApplicationStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            applications = loanApplicationRepository.findAll(pageable);
        }
        
        return applications.map(this::mapToResponse);
    }

    @Transactional
    public LoanApplicationResponse reviewApplication(String appId, LoanDecisionRequest request) {
        User admin = userService.getCurrentUser();
        LoanApplication application = loanApplicationRepository.findByApplicationId(appId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        application.setStatus(request.getDecision());
        application.setAdminRemarks(request.getRemarks());
        application.setReviewedBy(admin);
        application.setReviewedAt(LocalDateTime.now());

        if (request.getDecision() == ApplicationStatus.APPROVED) {
            application.setApprovedAmount(request.getApprovedAmount());
            application.setInterestRate(request.getInterestRate());
            application.setApprovedTenure(request.getTenure());
            
            loanService.createLoanFromApplication(application);
        }

        application = loanApplicationRepository.save(application);
        return mapToResponse(application);
    }

    private LoanApplicationResponse mapToResponse(LoanApplication application) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        String formattedDate = application.getSubmittedAt() != null 
                ? application.getSubmittedAt().format(formatter) 
                : "";

        return LoanApplicationResponse.builder()
                .id(application.getApplicationId())
                .name(application.getFullName())
                .date(formattedDate)
                .type(application.getLoanType() != null ? application.getLoanType().getName() : "")
                .amount("LKR " + String.format("%,.0f", application.getAmountRequested()))
                .status(application.getStatus().name())
                .amountRequested(application.getAmountRequested())
                .tenureMonths(application.getTenureMonths())
                .purpose(application.getPurpose())
                .email(application.getEmail())
                .phone(application.getPhone())
                .nic(application.getNic())
                .grossSalary(application.getGrossSalary())
                .creditScore(application.getCreditScore())
                .approvedAmount(application.getApprovedAmount())
                .interestRate(application.getInterestRate())
                .approvedTenure(application.getApprovedTenure())
                .adminRemarks(application.getAdminRemarks())
                .submittedAt(application.getSubmittedAt())
                .build();
    }
}
