package com.nba.nba.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "GAME")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "date", nullable = false)
	private LocalDate date;

	@Column(name = "home_score")
	private Integer homeScore;

	@Column(name = "away_score")
	private Integer awayScore;

	@Column(name = "game_type", length = 30)
	private String gameType;

	@ManyToOne
	@JoinColumn(name = "home_id", nullable = false)
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Team homeTeam;

	@ManyToOne
	@JoinColumn(name = "away_id", nullable = false)
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Team awayTeam;

	@ManyToOne
	@JoinColumn(name = "season_id", nullable = false)
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Season season;
}
