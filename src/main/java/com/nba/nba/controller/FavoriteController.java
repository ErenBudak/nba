package com.nba.nba.controller;

import com.nba.nba.entity.UserFavoritePlayer;
import com.nba.nba.entity.UserFavoriteTeam;
import com.nba.nba.repository.UserFavoritePlayerRepository;
import com.nba.nba.repository.UserFavoriteTeamRepository;
import com.nba.nba.entity.UserFavoritePlayerId;
import com.nba.nba.entity.UserFavoriteTeamId;
import com.nba.nba.security.RequireRole;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// favori takım ve oyuncu ekleme controller

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

  private final UserFavoriteTeamRepository favoriteTeamRepository;
  private final UserFavoritePlayerRepository favoritePlayerRepository;

  public FavoriteController(UserFavoriteTeamRepository favoriteTeamRepository,
      UserFavoritePlayerRepository favoritePlayerRepository) {
    this.favoriteTeamRepository = favoriteTeamRepository;
    this.favoritePlayerRepository = favoritePlayerRepository;
  }

  @PostMapping("/team/{teamId}")
  @RequireRole("USER")
  public ResponseEntity<?> addFavoriteTeam(@PathVariable Integer teamId, HttpServletRequest request) {
    Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));

    UserFavoriteTeam fav = new UserFavoriteTeam();
    fav.setUserId(userId);
    fav.setTeamId(teamId);

    favoriteTeamRepository.save(fav);
    return ResponseEntity.ok("Team added to favorites");
  }

  @PostMapping("/player/{playerId}")
  @RequireRole("USER")
  public ResponseEntity<?> addFavoritePlayer(@PathVariable Integer playerId, HttpServletRequest request) {
    Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));

    UserFavoritePlayer fav = new UserFavoritePlayer();
    fav.setUserId(userId);
    fav.setPlayerId(playerId);

    favoritePlayerRepository.save(fav);
    return ResponseEntity.ok("Player added to favorites");
  }

  @DeleteMapping("/team/{teamId}")
  @RequireRole("USER")
  public ResponseEntity<?> removeFavoriteTeam(@PathVariable Integer teamId, HttpServletRequest request) {
    Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));

    UserFavoriteTeamId id = new UserFavoriteTeamId(userId, teamId);
    if (!favoriteTeamRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    favoriteTeamRepository.deleteById(id);
    return ResponseEntity.ok("Team removed from favorites");
  }

  @DeleteMapping("/player/{playerId}")
  @RequireRole("USER")
  public ResponseEntity<?> removeFavoritePlayer(@PathVariable Integer playerId, HttpServletRequest request) {
    Integer userId = Integer.parseInt(request.getHeader("X-User-Id"));

    UserFavoritePlayerId id = new UserFavoritePlayerId(userId, playerId);
    if (!favoritePlayerRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    favoritePlayerRepository.deleteById(id);
    return ResponseEntity.ok("Player removed from favorites");
  }
}
