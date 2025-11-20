package com.nba.nba.repository;

import com.nba.nba.entity.UserFavoritePlayer;
import com.nba.nba.entity.UserFavoritePlayerId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFavoritePlayerRepository extends JpaRepository<UserFavoritePlayer, UserFavoritePlayerId> {
  List<UserFavoritePlayer> findByUserId(Integer userId);
}
