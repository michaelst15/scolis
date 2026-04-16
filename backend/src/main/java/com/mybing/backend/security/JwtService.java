package com.mybing.backend.security;

import com.mybing.backend.config.AppProperties;
import com.mybing.backend.users.UserAccount;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey key;
  private final String issuer;
  private final long expiresMinutes;

  public JwtService(AppProperties props) {
    var secret = props.getJwt().getSecret();
    var bytes = secret == null ? new byte[0] : secret.getBytes(StandardCharsets.UTF_8);
    if (bytes.length < 32) {
      throw new IllegalStateException("JWT secret must be at least 32 bytes");
    }
    this.key = Keys.hmacShaKeyFor(bytes);
    this.issuer = props.getJwt().getIssuer();
    this.expiresMinutes = props.getJwt().getExpiresMinutes();
  }

  public String issue(UserAccount user) {
    Instant now = Instant.now();
    Instant exp = now.plus(expiresMinutes, ChronoUnit.MINUTES);

    return Jwts
      .builder()
      .issuer(issuer)
      .subject(String.valueOf(user.getId()))
      .issuedAt(Date.from(now))
      .expiration(Date.from(exp))
      .claim("email", user.getEmail())
      .claim("name", user.getFullName())
      .claim("role", user.getRole().name())
      .claim("sid", user.getSessionId())
      .signWith(key)
      .compact();
  }

  public Jws<Claims> parse(String token) throws JwtException {
    return Jwts.parser().verifyWith(key).requireIssuer(issuer).build().parseSignedClaims(token);
  }
}
