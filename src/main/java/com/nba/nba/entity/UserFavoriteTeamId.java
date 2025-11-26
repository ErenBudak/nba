package com.nba.nba.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

// birleşik anahtar sınıfı

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteTeamId implements Serializable {
  private Integer userId;
  private Integer teamId;
}
