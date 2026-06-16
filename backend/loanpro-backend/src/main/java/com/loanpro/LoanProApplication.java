package com.loanpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application Entry Point for LoanPro Backend.
 *
 * LoanPro is a comprehensive loan management system that provides:
 * - User authentication and authorization using JWT
 * - Loan application and approval workflow
 * - Amortization and EMI calculations
 * - Wallet and transaction management
 * - Admin dashboard and reporting
 * - Document upload and verification
 *
 * CORS is configured centrally in {@link com.loanpro.config.CorsConfig} and
 * applied via Spring Security (see {@link com.loanpro.config.SecurityConfig}).
 *
 * @author LoanPro Team
 * @version 1.0.0
 */
@SpringBootApplication
public class LoanProApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoanProApplication.class, args);
    }
}
