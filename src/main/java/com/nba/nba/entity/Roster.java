package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ROSTER", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "player_id", "team_id", "season_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Roster {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "player_id", nullable = false)
  private Player player;

  @ManyToOne
  @JoinColumn(name = "team_id", nullable = false)
  private Team team;

  @ManyToOne
  @JoinColumn(name = "season_id", nullable = false)
  private Season season;

  @Column(name = "jersey_number")
  private Byte jerseyNumber;

  @Column(name = "POSITION", length = 5)
  private String position;
}
