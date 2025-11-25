package com.nba.nba.controller;

import com.nba.nba.dto.PlayerStatsDTO;
import com.nba.nba.config.entity.Player;
import com.nba.nba.config.entity.Stats;
import com.nba.nba.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

	@Autowired
	private PlayerService playerService;

	@GetMapping
	public List<Player> getAllPlayers() {
		return playerService.getAllPlayers();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Player> getPlayerById(@PathVariable Integer id) {
		return playerService.getPlayerById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/{id}/stats")
	public ResponseEntity<PlayerStatsDTO> getPlayerStats(@PathVariable Integer id, @RequestParam Integer seasonId) {
		PlayerStatsDTO stats = playerService.getSeasonStats(id, seasonId);
		if (stats == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(stats);
	}

	@Autowired
	private com.nba.nba.mapper.StatsMapper statsMapper;

	@GetMapping("/{id}/gamelog")
	public List<com.nba.nba.dto.StatsDTO> getGameLog(@PathVariable Integer id, @RequestParam Integer seasonId) {
		return playerService.getGameLog(id, seasonId).stream()
				.map(statsMapper::toDTO)
				.collect(java.util.stream.Collectors.toList());
	}

	@Autowired
	private com.nba.nba.service.AuditLogService auditLogService;

	@PostMapping
	@com.nba.nba.security.RequireRole("ADMIN")
	public ResponseEntity<Player> createPlayer(@RequestBody Player player,
			jakarta.servlet.http.HttpServletRequest request) {
		Player savedPlayer = playerService.savePlayer(player);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "INSERT_PLAYER", "PLAYER", savedPlayer.getId(),
				"Created player: " + savedPlayer.getPlayerName());

		return ResponseEntity.ok(savedPlayer);
	}

	@DeleteMapping("/{id}")
	@com.nba.nba.security.RequireRole("ADMIN")
	public ResponseEntity<?> deletePlayer(@PathVariable Integer id, jakarta.servlet.http.HttpServletRequest request) {
		playerService.deletePlayer(id);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "DELETE_PLAYER", "PLAYER", id, "Deleted player with ID: " + id);

		return ResponseEntity.ok().build();
	}
}
