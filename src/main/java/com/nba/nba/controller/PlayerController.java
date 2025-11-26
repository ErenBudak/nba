package com.nba.nba.controller;

import com.nba.nba.dto.PlayerStatsDTO;
import com.nba.nba.entity.Player;
import com.nba.nba.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.nba.nba.mapper.StatsMapper;
import com.nba.nba.dto.StatsDTO;
import com.nba.nba.service.AuditLogService;
import com.nba.nba.security.RequireRole;

// oyuncular ile ilgili işlemler için controller

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
	private StatsMapper statsMapper;

	@GetMapping("/{id}/gamelog")
	public List<StatsDTO> getGameLog(@PathVariable Integer id, @RequestParam Integer seasonId) {
		return playerService.getGameLog(id, seasonId).stream()
				.map(statsMapper::toDTO)
				.collect(java.util.stream.Collectors.toList());
	}

	@Autowired
	private AuditLogService auditLogService;

	@PostMapping
	@RequireRole("ADMIN")
	public ResponseEntity<Player> createPlayer(@RequestBody Player player,
			jakarta.servlet.http.HttpServletRequest request) {
		Player savedPlayer = playerService.savePlayer(player);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "INSERT_PLAYER", "PLAYER", savedPlayer.getId(),
				"Created player: " + savedPlayer.getPlayerName());

		return ResponseEntity.ok(savedPlayer);
	}

	@DeleteMapping("/{id}")
	@RequireRole("ADMIN")
	public ResponseEntity<?> deletePlayer(@PathVariable Integer id, jakarta.servlet.http.HttpServletRequest request) {
		playerService.deletePlayer(id);

		Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));
		auditLogService.logAction(userId, "DELETE_PLAYER", "PLAYER", id, "Deleted player with ID: " + id);

		return ResponseEntity.ok().build();
	}
}
