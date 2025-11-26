package com.nba.nba.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "PLAYER")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "player_name", nullable = false, length = 50)
	private String playerName;

	@Column(name = "player_surname", length = 50)
	private String playerSurname;

	@Column(name = "birth_day")
	private LocalDate birthDay;

	@Column(name = "height")
	private Integer height;

	@Column(name = "weight")
	private Integer weight;

	@Column(name = "draft_year")
	private Integer draftYear;

	@Column(name = "draft_order")
	private Integer draftOrder;

	@Column(name = "nationality", length = 50)
	private String nationality;
}
