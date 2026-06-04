package com.loanpro.controller;

import com.loanpro.dto.request.NotificationPreferencesRequest;
import com.loanpro.dto.request.PasswordChangeRequest;
import com.loanpro.dto.request.ProfileUpdateRequest;
import com.loanpro.dto.response.UserProfileResponse;
import com.loanpro.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notifications-preferences")
    public ResponseEntity<UserProfileResponse> updateNotificationPreferences(@RequestBody NotificationPreferencesRequest request) {
        return ResponseEntity.ok(userService.updateNotificationPreferences(request));
    }
}
