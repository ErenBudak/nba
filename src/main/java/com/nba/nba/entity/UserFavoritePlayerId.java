package com.nba.nba.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoritePlayerId implements Serializable {
  private Integer userId;
  private Integer playerId;
}
