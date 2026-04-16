package com.mybing.backend.security;

import com.mybing.backend.users.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  private final UserRepository users;

  public UserDetailsServiceImpl(UserRepository users) {
    this.users = users;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return users
      .findByEmailIgnoreCase(username)
      .map(UserPrincipal::new)
      .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
