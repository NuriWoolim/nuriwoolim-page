package com.nuriwoolim.pagebackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, length = 20)
    private String title;

    @Column(length = 100)
    private String description;

    @NotBlank
    @Enumerated(EnumType.STRING)
    private BoardType type = BoardType.OTHER;

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY)
    private List<Post> postList;
}
