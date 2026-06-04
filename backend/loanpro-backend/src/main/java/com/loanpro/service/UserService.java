package com.loanpro.service;

import com.loanpro.dto.request.NotificationPreferencesRequest;
import com.loanpro.dto.request.PasswordChangeRequest;
import com.loanpro.dto.request.ProfileUpdateRequest;
import com.loanpro.dto.response.UserProfileResponse;
import com.loanpro.entity.User;
import com.loanpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile() {
        User user = getCurrentUser();
        return mapToResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();
        
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setNic(request.getNic());
        user.setGender(request.getGender());
        user.setMaritalStatus(request.getMaritalStatus());
        user.setCity(request.getCity());
        user.setPostalCode(request.getPostalCode());
        
        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User user = getCurrentUser();
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserProfileResponse updateNotificationPreferences(NotificationPreferencesRequest request) {
        User user = getCurrentUser();
        
        if (request.getEmailAlerts() != null) {
            user.setEmailAlerts(request.getEmailAlerts());
        }
        if (request.getSmsNotifications() != null) {
            user.setSmsNotifications(request.getSmsNotifications());
        }
        
        user = userRepository.save(user);
        return mapToResponse(user);
    }
    
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole().name())
                .emailAlerts(user.getEmailAlerts())
                .smsNotifications(user.getSmsNotifications())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toLocalDate() : null)
                .build();
    }
}
