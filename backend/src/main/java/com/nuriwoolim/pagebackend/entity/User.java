package com.nuriwoolim.pagebackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, length = 20)
    private String username;

    @Email
    @NotBlank
    @Column(unique = true, length = 30)
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    @Column(unique = true, length = 10)
    private String nickname;

    @NotBlank
    @Enumerated(EnumType.ORDINAL)
    private UserType type = UserType.NONMEMBER;

    @NotNull
    private LocalDateTime createdDate = LocalDateTime.now();

    private Integer year;

    private boolean email_verified = false;
}
