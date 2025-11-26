package com.nba.nba.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.nba.nba.entity.Stats;
import com.nba.nba.repository.StatsRepository;
import java.util.*;
import com.nba.nba.service.StatsService;
import com.nba.nba.security.RequireRole;
import com.nba.nba.dto.CreateStatsDTO;
import org.springframework.beans.factory.annotation.Autowired;

// istatistikler ile ilgili işlemler için controller

@RestController
@RequestMapping("/api/stats")
public class StatsController {
	private final StatsRepository repo;

	public StatsController(StatsRepository repo) {
		this.repo = repo;
	}

	@GetMapping
	public List<Stats> all() {
		return repo.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Stats> get(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@Autowired
	private StatsService statsService;

	@PostMapping
	@RequireRole("ADMIN")
	public Stats create(@RequestBody CreateStatsDTO s) {
		return statsService.createStats(s);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Stats> update(@PathVariable Integer id, @RequestBody Stats s) {
		return repo.findById(id).map(existing -> {
			s.setId(existing.getId());
			return ResponseEntity.ok(repo.save(s));
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Integer id) {
		if (!repo.existsById(id))
			return ResponseEntity.notFound().build();
		repo.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
