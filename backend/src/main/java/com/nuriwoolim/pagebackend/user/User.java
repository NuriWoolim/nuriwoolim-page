package com.nuriwoolim.pagebackend.user;

import com.nuriwoolim.pagebackend.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.user.dto.UserUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Optional;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

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

    @Column(nullable = false)
    @Enumerated(EnumType.ORDINAL)
    @Builder.Default
    private UserType type = UserType.NONMEMBER;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate createdDate = LocalDate.now();

    private Integer year;

    @Builder.Default
    private boolean emailVerified = false;

    public static User of(UserCreateRequest userCreateRequest) {
        User user = User.builder()
                .username(userCreateRequest.getUsername())
                .email(userCreateRequest.getEmail())
                .password(userCreateRequest.getPassword())
                .nickname(userCreateRequest.getNickname())
                .build();
        return user;
    }

    public void update(UserUpdateRequest userUpdateRequest) {
        Optional.ofNullable(userUpdateRequest.getEmail()).ifPresent(i -> this.email = i);
        Optional.ofNullable(userUpdateRequest.getPassword()).ifPresent(i -> this.password = i);
        Optional.ofNullable(userUpdateRequest.getNickname()).ifPresent(i -> this.nickname = i);
        Optional.ofNullable(userUpdateRequest.getType()).ifPresent(i -> this.type = i);
        Optional.ofNullable(userUpdateRequest.getYear()).ifPresent(i -> this.year = i);
    }
}
