package com.mybing.backend.auth;

public record AuthResponse(String accessToken, UserDto user) {}

