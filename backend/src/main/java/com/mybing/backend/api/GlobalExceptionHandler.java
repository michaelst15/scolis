package com.mybing.backend.api;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
    String msg = "Validasi gagal";
    var fe = ex.getBindingResult().getFieldError();
    if (fe != null) msg = fe.getField() + ": " + fe.getDefaultMessage();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(msg));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(ex.getMessage()));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ApiError> handleBadCreds(BadCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError("Email atau password salah"));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleIllegalArg(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(ex.getMessage()));
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ApiError> handleStatus(ResponseStatusException ex) {
    String msg = ex.getReason() != null ? ex.getReason() : "Error";
    return ResponseEntity.status(ex.getStatusCode()).body(new ApiError(msg));
  }
}
