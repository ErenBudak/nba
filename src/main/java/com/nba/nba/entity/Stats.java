package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STATS", uniqueConstraints = { @UniqueConstraint(columnNames = { "player_id", "game_id" }) })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stats {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "player_id", nullable = false)
	private Player player;

	@ManyToOne
	@JoinColumn(name = "game_id", nullable = false)
	private Game game;

	@ManyToOne
	@JoinColumn(name = "team_id", nullable = false)
	private Team team;

	@Column(name = "minutes_played")
	private Float minutesPlayed;

	@Column(name = "points")
	private Integer points;

	@Column(name = "rebounds")
	private Integer rebounds;

	@Column(name = "assists")
	private Integer assists;

	@Column(name = "steals")
	private Integer steals;

	@Column(name = "blocks")
	private Integer blocks;

	@Column(name = "turnovers")
	private Integer turnovers;

	@Column(name = "field_goals_made")
	private Integer fieldGoalsMade;

	@Column(name = "field_goals_attempted")
	private Integer fieldGoalsAttempted;

	@Column(name = "three_pointers_made")
	private Integer threePointersMade;

	@Column(name = "three_pointers_attempted")
	private Integer threePointersAttempted;

	@Column(name = "free_throws_made")
	private Integer freeThrowsMade;

	@Column(name = "free_throws_attempted")
	private Integer freeThrowsAttempted;

	@Column(name = "personal_fouls")
	private Integer personalFouls;
}
