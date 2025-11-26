package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "USER_FAVORITE_TEAM")
@IdClass(UserFavoriteTeamId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavoriteTeam {

  @Id
  @Column(name = "user_id")
  private Integer userId;

  @Id
  @Column(name = "team_id")
  private Integer teamId;

  @ManyToOne
  @JoinColumn(name = "user_id", insertable = false, updatable = false)
  private AppUser user;

  @ManyToOne
  @JoinColumn(name = "team_id", insertable = false, updatable = false)
  private Team team;

  @Column(name = "created_at", insertable = false, updatable = false)
  private LocalDateTime createdAt;
}
