package com.nba.nba.repository;

import com.nba.nba.entity.UserFavoriteTeam;
import com.nba.nba.entity.UserFavoriteTeamId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFavoriteTeamRepository extends JpaRepository<UserFavoriteTeam, UserFavoriteTeamId> {
  List<UserFavoriteTeam> findByUserId(Integer userId);
}
