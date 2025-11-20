package com.nba.nba.controller;

import com.nba.nba.dto.StandingsDTO;
import com.nba.nba.entity.Game;
import com.nba.nba.entity.Stats;
import com.nba.nba.repository.StatsRepository;
import com.nba.nba.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

	@Autowired
	private GameService gameService;

	@Autowired
	private StatsRepository statsRepository;

	@GetMapping("/recent")
	public List<Game> getRecentGames() {
		return gameService.getRecentGames();
	}

	@GetMapping("/standings")
	public List<StandingsDTO> getStandings(@RequestParam Integer seasonId) {
		return gameService.getStandings(seasonId);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Game> getGameById(@PathVariable Integer id) {
		return gameService.getGameById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/boxscore")
	public List<Stats> getBoxScore(@PathVariable Integer id) {
		return statsRepository.findByGameId(id);
	}
}
