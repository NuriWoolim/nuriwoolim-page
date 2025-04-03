package com.nuriwoolim.pagebackend.entity;

import com.nuriwoolim.pagebackend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class TimeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, length = 20)
    private String title;

    @Column(length = 100)
    private String description;

    @NotBlank
    private Integer startHour;
    @NotBlank
    private Integer endHour;

    @NotBlank
    private LocalDate date;

    @ManyToOne
    private User user;
}
