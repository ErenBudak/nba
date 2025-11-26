package com.nba.nba.controller;

import com.nba.nba.dto.StandingsDTO;
import com.nba.nba.repository.StatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.nba.nba.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.nba.nba.mapper.StatsMapper;
import com.nba.nba.dto.GameDTO;
import com.nba.nba.dto.SeasonDTO;
import com.nba.nba.dto.StatsDTO;
import com.nba.nba.dto.CreateGameDTO;
import com.nba.nba.security.RequireRole;

// maçlar ile ilgili işlemler için controller

@RestController
@RequestMapping("/api/games")
public class GameController {

	@Autowired
	private GameService gameService;

	@Autowired
	private StatsRepository statsRepository;

	@Autowired
	private StatsMapper statsMapper;

	@Autowired
	private com.nba.nba.service.AuditLogService auditLogService;

	@GetMapping
	public List<GameDTO> getAllGames(@RequestParam(required = false) Integer seasonId,
			@RequestParam(required = false) Integer teamId) {
		return gameService.getAllGames(seasonId, teamId);
	}

	@GetMapping("/seasons")
	public List<SeasonDTO> getAllSeasons() {
		return gameService.getAllSeasons();
	}

	@GetMapping("/recent")
	public List<GameDTO> getRecentGames() {
		return gameService.getRecentGames();
	}

	@GetMapping("/standings")
	public List<StandingsDTO> getStandings(@RequestParam(required = false) Integer seasonId) {
		if (seasonId == null) {
			List<SeasonDTO> seasons = gameService.getAllSeasons();
			if (seasons.isEmpty()) {
				return java.util.Collections.emptyList();
			}
			seasons.sort(java.util.Comparator.comparing(SeasonDTO::getId).reversed());
			seasonId = seasons.get(0).getId();
		}
		return gameService.getStandings(seasonId);
	}

	@GetMapping("/{id}")
	public ResponseEntity<GameDTO> getGameById(@PathVariable Integer id) {
		return gameService.getGameById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/boxscore")
	public List<StatsDTO> getBoxScore(@PathVariable Integer id) {
		return statsRepository.findByGameId(id).stream()
				.map(statsMapper::toDTO)
				.collect(java.util.stream.Collectors.toList());
	}

	@PostMapping
	@RequireRole("ADMIN")
	public ResponseEntity<GameDTO> createGame(@RequestBody CreateGameDTO dto) {
		GameDTO createdGame = gameService.createGame(dto);
		return ResponseEntity.ok(createdGame);
	}

	@DeleteMapping("/{id}")
	@RequireRole("ADMIN")
	public ResponseEntity<?> deleteGame(@PathVariable Integer id, jakarta.servlet.http.HttpServletRequest request) {
		gameService.deleteGame(id);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "DELETE_GAME", "GAME", id, "Deleted game with ID: " + id);

		return ResponseEntity.ok().build();
	}
}
