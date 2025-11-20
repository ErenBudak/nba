package com.nba.nba.service;

import com.nba.nba.dto.LoginDTO;
import com.nba.nba.dto.RegisterDTO;
import com.nba.nba.entity.AppUser;
import com.nba.nba.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

  private final AppUserRepository appUserRepository;

  public AuthService(AppUserRepository appUserRepository) {
    this.appUserRepository = appUserRepository;
  }

  public AppUser register(RegisterDTO dto) {
    if (appUserRepository.findByUsername(dto.getUsername()).isPresent()) {
      throw new RuntimeException("Username already exists");
    }
    if (appUserRepository.findByEmail(dto.getEmail()).isPresent()) {
      throw new RuntimeException("Email already exists");
    }

    AppUser user = new AppUser();
    user.setUsername(dto.getUsername());
    user.setEmail(dto.getEmail());
    user.setPassword(dto.getPassword());
    user.setRole("USER");

    return appUserRepository.save(user);
  }

  public AppUser login(LoginDTO dto) {
    Optional<AppUser> userOpt = appUserRepository.findByUsername(dto.getUsername());
    if (userOpt.isEmpty()) {
      throw new RuntimeException("User not found");
    }

    AppUser user = userOpt.get();
    if (!user.getPassword().equals(dto.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    return user;
  }
}
