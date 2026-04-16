package com.mybing.backend.otp;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
  Optional<EmailOtp> findTopByEmailIgnoreCaseOrderByCreatedAtDesc(String email);
}

