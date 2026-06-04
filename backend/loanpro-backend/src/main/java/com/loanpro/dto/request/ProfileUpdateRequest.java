package com.loanpro.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileUpdateRequest {
    
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String address;
    private String nic;
    private String gender;
    private String maritalStatus;
    private String city;
    private String postalCode;
}
