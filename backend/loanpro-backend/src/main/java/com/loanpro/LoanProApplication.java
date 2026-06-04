package com.loanpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

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
 * @author LoanPro Team
 * @version 1.0.0
 */
@SpringBootApplication
public class LoanProApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoanProApplication.class, args);
    }

    /**
     * Configure CORS to allow requests from frontend (React Vite dev server).
     * 
     * Allowed:
     * - Origins: http://localhost:5173 (Vite dev), configurable via properties
     * - Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
     * - Headers: Authorization, Content-Type, etc.
     * - Credentials: true (allow cookies/tokens)
     * 
     * @return CORS configuration source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
