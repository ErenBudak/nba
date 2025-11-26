package com.nba.nba.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.nba.nba.entity.Player;

public interface PlayerRepository extends JpaRepository<Player, Integer> {
}
