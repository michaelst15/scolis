package com.mybing.backend.auth;

import com.mybing.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AuthController {
  private final AuthService auth;

  public AuthController(AuthService auth) {
    this.auth = auth;
  }

  @PostMapping("/auth/register")
  public RegisterResponse register(@Valid @RequestBody RegisterRequest req) {
    return auth.register(req);
  }

  @PostMapping("/auth/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest req) {
    return auth.login(req);
  }

  @PostMapping("/auth/logout")
  public String logout(@AuthenticationPrincipal Object principal) {
    if (principal instanceof UserPrincipal up) {
      auth.logout(up.getUser());
      return "ok";
    }
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  @GetMapping("/me")
  public UserDto me(@AuthenticationPrincipal Object principal) {
    if (principal instanceof UserPrincipal up) return auth.toDto(up.getUser());
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
  }

  @GetMapping("/health")
  public String health() {
    return "ok";
  }
}
