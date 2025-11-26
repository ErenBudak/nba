package com.nba.nba.dto;

import lombok.Data;

@Data
public class UserDTO {
  private Integer id;
  private String username;
  private String email;
  private String role;
}
