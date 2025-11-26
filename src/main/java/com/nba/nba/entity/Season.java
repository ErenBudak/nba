package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SEASON")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Season {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name", nullable = false, length = 10, unique = true)
	private String name;
}
