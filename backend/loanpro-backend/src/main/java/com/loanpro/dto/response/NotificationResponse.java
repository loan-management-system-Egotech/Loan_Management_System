package com.loanpro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String time; // e.g. "2 hours ago"
    private Boolean unread;
    private String type; // e.g. "success"
}
