package com.nba.nba.dto;

import lombok.Data;

@Data
public class RegisterDTO {
  private String username;
  private String email;
  private String password;
  private String role; // Optional, default to USER if null
}
