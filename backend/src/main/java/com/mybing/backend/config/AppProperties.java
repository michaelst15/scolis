package com.mybing.backend.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
  private Jwt jwt = new Jwt();
  private Cors cors = new Cors();
  private Session session = new Session();
  private Otp otp = new Otp();

  public Jwt getJwt() {
    return jwt;
  }

  public void setJwt(Jwt jwt) {
    this.jwt = jwt;
  }

  public Cors getCors() {
    return cors;
  }

  public void setCors(Cors cors) {
    this.cors = cors;
  }

  public Session getSession() {
    return session;
  }

  public void setSession(Session session) {
    this.session = session;
  }

  public Otp getOtp() {
    return otp;
  }

  public void setOtp(Otp otp) {
    this.otp = otp;
  }

  public static class Jwt {
    private String secret;
    private String issuer;
    private long expiresMinutes;

    public String getSecret() {
      return secret;
    }

    public void setSecret(String secret) {
      this.secret = secret;
    }

    public String getIssuer() {
      return issuer;
    }

    public void setIssuer(String issuer) {
      this.issuer = issuer;
    }

    public long getExpiresMinutes() {
      return expiresMinutes;
    }

    public void setExpiresMinutes(long expiresMinutes) {
      this.expiresMinutes = expiresMinutes;
    }
  }

  public static class Cors {
    private List<String> allowedOrigins;

    public List<String> getAllowedOrigins() {
      return allowedOrigins;
    }

    public void setAllowedOrigins(List<String> allowedOrigins) {
      this.allowedOrigins = allowedOrigins;
    }
  }

  public static class Session {
    private long maxIdleMinutes = 2;

    public long getMaxIdleMinutes() {
      return maxIdleMinutes;
    }

    public void setMaxIdleMinutes(long maxIdleMinutes) {
      this.maxIdleMinutes = maxIdleMinutes;
    }
  }

  public static class Otp {
    private long ttlMinutes = 5;
    private long resendCooldownSeconds = 30;
    private int maxAttempts = 5;

    public long getTtlMinutes() {
      return ttlMinutes;
    }

    public void setTtlMinutes(long ttlMinutes) {
      this.ttlMinutes = ttlMinutes;
    }

    public long getResendCooldownSeconds() {
      return resendCooldownSeconds;
    }

    public void setResendCooldownSeconds(long resendCooldownSeconds) {
      this.resendCooldownSeconds = resendCooldownSeconds;
    }

    public int getMaxAttempts() {
      return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
      this.maxAttempts = maxAttempts;
    }
  }
}
