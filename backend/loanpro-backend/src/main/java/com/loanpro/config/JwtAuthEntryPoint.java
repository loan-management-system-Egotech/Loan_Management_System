package com.loanpro.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Returns a clean 401 JSON body for unauthenticated requests to protected
 * endpoints (missing / invalid / expired JWT), instead of Spring Security's
 * default 403. The frontend relies on the 401 status to clear its stored
 * session and redirect the user to /login.
 *
 * The body shape mirrors {@code ApiResponse} for consistency with the rest
 * of the API's error responses.
 */
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", "Authentication required or session expired");
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("timestamp", LocalDateTime.now().toString());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
