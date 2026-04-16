package com.mybing.backend.otp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(
  name = "email_otps",
  indexes = { @Index(name = "idx_email_otps_email", columnList = "email") }
)
public class EmailOtp {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String codeHash;

  @Column(nullable = false)
  private Instant expiresAt;

  @Column
  private Instant verifiedAt;

  @Column
  private Instant consumedAt;

  @Column(nullable = false)
  private int attempts;

  @Column(nullable = false)
  private Instant lastSentAt;

  @Column(nullable = false)
  private Instant createdAt;

  protected EmailOtp() {}

  public EmailOtp(
    String email,
    String codeHash,
    Instant expiresAt,
    Instant verifiedAt,
    Instant consumedAt,
    int attempts,
    Instant lastSentAt,
    Instant createdAt
  ) {
    this.email = email;
    this.codeHash = codeHash;
    this.expiresAt = expiresAt;
    this.verifiedAt = verifiedAt;
    this.consumedAt = consumedAt;
    this.attempts = attempts;
    this.lastSentAt = lastSentAt;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getCodeHash() {
    return codeHash;
  }

  public void setCodeHash(String codeHash) {
    this.codeHash = codeHash;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
  }

  public Instant getVerifiedAt() {
    return verifiedAt;
  }

  public void setVerifiedAt(Instant verifiedAt) {
    this.verifiedAt = verifiedAt;
  }

  public Instant getConsumedAt() {
    return consumedAt;
  }

  public void setConsumedAt(Instant consumedAt) {
    this.consumedAt = consumedAt;
  }

  public int getAttempts() {
    return attempts;
  }

  public void setAttempts(int attempts) {
    this.attempts = attempts;
  }

  public Instant getLastSentAt() {
    return lastSentAt;
  }

  public void setLastSentAt(Instant lastSentAt) {
    this.lastSentAt = lastSentAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}

