package com.loanpro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoanTypeResponse {
    private String id; // Use code as ID for frontend
    private String title;
    private String limit; // e.g. "Up to LKR 500,000"
    private String description;
}
