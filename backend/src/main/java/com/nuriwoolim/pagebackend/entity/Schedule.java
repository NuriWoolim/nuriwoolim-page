package com.nuriwoolim.pagebackend.entity;

import com.nuriwoolim.pagebackend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String title;

    @Column(length = 100)
    private String description;

    @Column(nullable = false)
    private Integer startHour;
    @Column(nullable = false)
    private Integer endHour;

    @Column(nullable = false)
    private Integer day;

    @ManyToOne
    private WeekSchedule weekSchedule;
    @ManyToOne
    private User user;
}
