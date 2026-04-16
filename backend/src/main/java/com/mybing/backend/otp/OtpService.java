package com.mybing.backend.otp;

import com.mybing.backend.config.AppProperties;
import com.mybing.backend.users.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OtpService {
  private final EmailOtpRepository otps;
  private final UserRepository users;
  private final MailService mail;
  private final AppProperties props;
  private final SecureRandom random = new SecureRandom();
  private final PasswordEncoder encoder = new BCryptPasswordEncoder();

  public OtpService(EmailOtpRepository otps, UserRepository users, MailService mail, AppProperties props) {
    this.otps = otps;
    this.users = users;
    this.mail = mail;
    this.props = props;
  }

  public void requestOtp(String emailRaw) {
    String email = emailRaw.trim().toLowerCase();
    if (users.existsByEmailIgnoreCase(email)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
    }

    Instant now = Instant.now();
    var existing = otps.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(email).orElse(null);
    if (existing != null) {
      long cd = props.getOtp().getResendCooldownSeconds();
      if (existing.getLastSentAt() != null && existing.getLastSentAt().isAfter(now.minus(cd, ChronoUnit.SECONDS))) {
        throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Tunggu sebentar sebelum kirim ulang OTP");
      }
    }

    String code = String.format("%06d", random.nextInt(1_000_000));
    String hash = encoder.encode(code);
    long ttlMinutes = props.getOtp().getTtlMinutes();
    Instant exp = now.plus(ttlMinutes, ChronoUnit.MINUTES);
    EmailOtp record = new EmailOtp(email, hash, exp, null, null, 0, now, now);
    otps.save(record);
    mail.sendOtp(email, code, ttlMinutes);
  }

  public void verifyOtp(String emailRaw, String code) {
    String email = emailRaw.trim().toLowerCase();
    EmailOtp otp = otps.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OTP belum diminta"));
    Instant now = Instant.now();
    if (otp.getConsumedAt() != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP sudah digunakan");
    if (otp.getExpiresAt().isBefore(now)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP sudah kedaluwarsa");
    if (otp.getAttempts() >= props.getOtp().getMaxAttempts()) throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Terlalu banyak percobaan OTP");

    otp.setAttempts(otp.getAttempts() + 1);
    boolean ok = encoder.matches(code, otp.getCodeHash());
    if (!ok) {
      otps.save(otp);
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Kode OTP salah");
    }

    otp.setVerifiedAt(now);
    otps.save(otp);
  }

  public void consumeVerifiedOtp(String emailRaw) {
    String email = emailRaw.trim().toLowerCase();
    EmailOtp otp = otps.findTopByEmailIgnoreCaseOrderByCreatedAtDesc(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email belum diverifikasi"));
    Instant now = Instant.now();
    if (otp.getVerifiedAt() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email belum diverifikasi");
    if (otp.getConsumedAt() != null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email sudah dipakai untuk daftar");
    if (otp.getExpiresAt().isBefore(now)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP sudah kedaluwarsa");
    otp.setConsumedAt(now);
    otps.save(otp);
  }
}
