package com.mybing.backend.security;

import com.mybing.backend.users.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwt;
  private final UserDetailsServiceImpl users;
  private final UserRepository userRepo;

  public JwtAuthFilter(JwtService jwt, UserDetailsServiceImpl users, UserRepository userRepo) {
    this.jwt = jwt;
    this.users = users;
    this.userRepo = userRepo;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header == null || !header.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = header.substring("Bearer ".length()).trim();
    if (token.isEmpty()) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      Claims claims = jwt.parse(token).getPayload();
      String email = claims.get("email", String.class);
      String sid = claims.get("sid", String.class);
      if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        var principal = users.loadUserByUsername(email);
        if (principal instanceof UserPrincipal up) {
          String currentSid = up.getUser().getSessionId();
          if (currentSid == null || sid == null || !currentSid.equals(sid)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Session expired\"}");
            return;
          }

          Instant now = Instant.now();
          Instant lastSeen = up.getUser().getSessionLastSeenAt();
          if (lastSeen == null || lastSeen.isBefore(now.minus(30, ChronoUnit.SECONDS))) {
            up.getUser().setSessionLastSeenAt(now);
            userRepo.save(up.getUser());
          }
        }
        var auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (JwtException ignored) {
      SecurityContextHolder.clearContext();
    }

    filterChain.doFilter(request, response);
  }
}
