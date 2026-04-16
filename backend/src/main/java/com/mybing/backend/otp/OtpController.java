package com.mybing.backend.otp;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/otp")
public class OtpController {
  private final OtpService otp;

  public OtpController(OtpService otp) {
    this.otp = otp;
  }

  @PostMapping("/request")
  public OtpStatusResponse request(@Valid @RequestBody OtpRequest req) {
    otp.requestOtp(req.email());
    return new OtpStatusResponse("sent");
  }

  @PostMapping("/verify")
  public OtpStatusResponse verify(@Valid @RequestBody OtpVerifyRequest req) {
    otp.verifyOtp(req.email(), req.code());
    return new OtpStatusResponse("verified");
  }
}

