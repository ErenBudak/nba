package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SEASON_AWARDS", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "season_id", "award_type" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeasonAwards {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "season_id", nullable = false)
  private Season season;

  @ManyToOne
  @JoinColumn(name = "player_id", nullable = false)
  private Player player;

  @Column(name = "award_type", nullable = false, length = 50)
  private String awardType;
}
