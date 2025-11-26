package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_FAVORITE_PLAYER")
@IdClass(UserFavoritePlayerId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoritePlayer {

  @Id
  @Column(name = "user_id")
  private Integer userId;

  @Id
  @Column(name = "player_id")
  private Integer playerId;

  @ManyToOne
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private AppUser user;

  @ManyToOne
  @JoinColumn(name = "player_id", insertable = false, updatable = false)
  private Player player;

  @Column(name = "created_at", insertable = false, updatable = false)
  private LocalDateTime createdAt;
}
