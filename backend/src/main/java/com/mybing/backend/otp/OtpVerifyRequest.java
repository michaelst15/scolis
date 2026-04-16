package com.mybing.backend.otp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpVerifyRequest(
  @Email @NotBlank String email,
  @Pattern(regexp = "^[0-9]{6}$") String code
) {}

