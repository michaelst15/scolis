package com.mybing.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
  @NotBlank String fullName,
  @Email @NotBlank String email,
  @Size(min = 6, max = 72) String password,
  @NotBlank String otpCode
) {}
