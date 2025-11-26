package com.nba.nba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CONFERENCE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conference {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "conference_name", length = 4)
	private String conferenceName;
}
