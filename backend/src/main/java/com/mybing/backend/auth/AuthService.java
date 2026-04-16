package com.mybing.backend.auth;

import com.mybing.backend.config.AppProperties;
import com.mybing.backend.security.JwtService;
import com.mybing.backend.otp.OtpService;
import com.mybing.backend.users.UserAccount;
import com.mybing.backend.users.UserRepository;
import com.mybing.backend.users.UserRole;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
  private static final String ADMIN_EMAIL = "admin@gmail.com";
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authManager;
  private final JwtService jwt;
  private final AppProperties props;
  private final OtpService otp;

  public AuthService(UserRepository users, PasswordEncoder encoder, AuthenticationManager authManager, JwtService jwt, AppProperties props, OtpService otp) {
    this.users = users;
    this.encoder = encoder;
    this.authManager = authManager;
    this.jwt = jwt;
    this.props = props;
    this.otp = otp;
  }

  public RegisterResponse register(RegisterRequest req) {
    String email = req.email().trim().toLowerCase();
    if (users.existsByEmailIgnoreCase(email)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email sudah terdaftar");
    }

    UserRole role = ADMIN_EMAIL.equalsIgnoreCase(email) ? UserRole.ADMIN : UserRole.USER;
    otp.verifyOtp(email, req.otpCode());
    otp.consumeVerifiedOtp(email);

    UserAccount user = new UserAccount(
      req.fullName().trim(),
      email,
      encoder.encode(req.password()),
      role,
      Instant.now()
    );
    UserAccount saved = users.save(user);
    return new RegisterResponse(toDto(saved));
  }

  public AuthResponse login(LoginRequest req) {
    try {
      authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
    } catch (AuthenticationException ex) {
      throw ex;
    }
    UserAccount user = users.findByEmailIgnoreCase(req.email()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email atau password salah"));
    long maxIdle = props.getSession().getMaxIdleMinutes();
    Instant lastSeen = user.getSessionLastSeenAt();
    if (user.getSessionId() != null && lastSeen != null) {
      Instant cutoff = Instant.now().minus(maxIdle, ChronoUnit.MINUTES);
      if (lastSeen.isAfter(cutoff)) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Akun sedang digunakan di perangkat lain");
      }
    }

    user.setSessionId(UUID.randomUUID().toString());
    user.setSessionLastSeenAt(Instant.now());
    users.save(user);
    String token = jwt.issue(user);
    return new AuthResponse(token, toDto(user));
  }

  public void logout(UserAccount user) {
    user.setSessionId(null);
    user.setSessionLastSeenAt(null);
    users.save(user);
  }

  public UserDto toDto(UserAccount user) {
    return new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
  }
}
