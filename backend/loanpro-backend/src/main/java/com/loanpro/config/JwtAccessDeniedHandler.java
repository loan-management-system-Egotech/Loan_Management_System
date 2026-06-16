package com.loanpro.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Returns a clean 403 JSON body when an AUTHENTICATED user lacks the required
 * role (e.g. a CUSTOMER calling an /api/admin endpoint).
 *
 * Writing the body directly — instead of the default handler's
 * {@code response.sendError(403)} — is deliberate: sendError triggers a servlet
 * ERROR re-dispatch back through the security chain where the request is no
 * longer authenticated, which would otherwise surface as a misleading 401.
 * The frontend distinguishes 401 (clear session, redirect to /login) from 403
 * (show "not allowed" without logging the user out), so the status must be right.
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", "Access denied. You do not have permission to access this resource.");
        body.put("status", HttpStatus.FORBIDDEN.value());
        body.put("timestamp", LocalDateTime.now().toString());

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
