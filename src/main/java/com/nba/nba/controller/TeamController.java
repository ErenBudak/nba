package com.nba.nba.controller;

import com.nba.nba.entity.Game;
import com.nba.nba.entity.Roster;
import com.nba.nba.entity.Team;
import com.nba.nba.service.GameService;
import com.nba.nba.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

	@Autowired
	private TeamService teamService;

	@Autowired
	private GameService gameService;

	@GetMapping
	public List<Team> getAllTeams() {
		return teamService.getAllTeams();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Team> getTeamById(@PathVariable Integer id) {
		return teamService.getTeamById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/roster")
	public List<Roster> getRoster(@PathVariable Integer id, @RequestParam Integer seasonId) {
		return teamService.getRoster(id, seasonId);
	}

	@GetMapping("/{id}/games")
	public List<Game> getTeamGames(@PathVariable Integer id) {
		return gameService.getTeamGames(id);
	}
}
