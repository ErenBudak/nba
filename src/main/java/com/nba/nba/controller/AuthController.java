package com.nba.nba.controller;

import com.nba.nba.dto.LoginDTO;
import com.nba.nba.dto.RegisterDTO;
import com.nba.nba.entity.AppUser;
import com.nba.nba.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allow all origins for simplicity
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterDTO dto) {
    try {
      AppUser user = authService.register(dto);
      return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
    try {
      AppUser user = authService.login(dto);
      return ResponseEntity.ok(user);
    } catch (RuntimeException e) {
      return ResponseEntity.status(401).body(e.getMessage());
    }
  }
}
