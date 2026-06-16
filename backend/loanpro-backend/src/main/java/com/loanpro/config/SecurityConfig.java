package com.loanpro.config;

import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Uses the corsConfigurationSource bean (see CorsConfig) inside the filter chain.
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(req ->
                // Don't re-authorize internal ERROR / ASYNC dispatches — otherwise a
                // denied request's error forward gets re-evaluated as unauthenticated
                // and a legitimate 403 surfaces as a 401.
                req.dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.ASYNC).permitAll()
                   .requestMatchers("/api/auth/**").permitAll()
                   .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**", "/v3/api-docs/**").permitAll()
                   .requestMatchers("/h2-console/**").permitAll()
                   .requestMatchers("/api/admin/**").hasRole("ADMIN")
                   .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                // 401 for missing/invalid/expired credentials (frontend clears session, redirects to /login)
                .authenticationEntryPoint(jwtAuthEntryPoint)
                // 403 for an authenticated user lacking the required role (frontend shows "not allowed")
                .accessDeniedHandler(jwtAccessDeniedHandler)
            )
            // Allow the H2 console to render in a frame when the "h2" profile is active.
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
