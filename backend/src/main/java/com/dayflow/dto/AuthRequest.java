package com.dayflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {

    @NotBlank(message = "Login ID or Email is required")
    private String loginIdOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}
