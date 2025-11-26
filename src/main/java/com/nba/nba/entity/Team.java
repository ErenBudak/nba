package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TEAM")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "name")
	private String name;

	@Column(name = "abbreviation", length = 3)
	private String abbreviation;

	@Column(name = "city")
	private String city;

	@ManyToOne
	@JoinColumn(name = "division_id", nullable = false)
	@com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Division division;
}
