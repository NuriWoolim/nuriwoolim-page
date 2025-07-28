package com.nuriwoolim.pagebackend.domain.user.entity;

import com.nuriwoolim.pagebackend.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class PendingUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String username;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column
    private String password;

    @Column(nullable = false, unique = true, length = 10)
    private String nickname;

    @Builder.Default
    private boolean emailVerified = false;

    @Builder.Default
    private boolean isDeleted = false;
}
