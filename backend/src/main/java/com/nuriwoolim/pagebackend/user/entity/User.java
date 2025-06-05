package com.nuriwoolim.pagebackend.user.entity;

import com.nuriwoolim.pagebackend.core.BaseEntity;
import com.nuriwoolim.pagebackend.core.security.RefreshToken;
import com.nuriwoolim.pagebackend.entity.Comment;
import com.nuriwoolim.pagebackend.entity.Post;
import com.nuriwoolim.pagebackend.entity.Schedule;
import com.nuriwoolim.pagebackend.entity.TimeTable;
import com.nuriwoolim.pagebackend.entity.WeekSchedule;
import com.nuriwoolim.pagebackend.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.user.dto.UserUpdateRequest;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.ArrayList;
import java.util.List;
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
public class User extends BaseEntity {

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
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserType type = UserType.NONMEMBER;

    private Integer year;

    @Builder.Default
    private boolean emailVerified = false;

    @Builder.Default
    private boolean isDeleted = false;

    @OneToMany(mappedBy = "writer", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Post> postList = new ArrayList<>();

    @OneToMany(mappedBy = "writer", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Comment> commentList = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = true,
            cascade = {jakarta.persistence.CascadeType.REMOVE})
    @Builder.Default
    private List<Schedule> scheduleList = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = true,
            cascade = {jakarta.persistence.CascadeType.REMOVE})
    @Builder.Default
    private List<TimeTable> timeTableList = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = true,
            cascade = {jakarta.persistence.CascadeType.REMOVE})
    @Builder.Default
    private List<WeekSchedule> weekScheduleList = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private RefreshToken refreshToken;

    public static User of(UserCreateRequest userCreateRequest) {
        User user = User.builder()
                .username(userCreateRequest.username())
                .email(userCreateRequest.email())
                .password(userCreateRequest.password())
                .nickname(userCreateRequest.nickname())
                .build();
        return user;
    }

    public void update(UserUpdateRequest userUpdateRequest) {
        if (userUpdateRequest.email() != null) {
            this.email = userUpdateRequest.email();
        }
        if (userUpdateRequest.password() != null) {
            this.password = userUpdateRequest.password();
        }
        if (userUpdateRequest.nickname() != null) {
            this.nickname = userUpdateRequest.nickname();
        }
        if (userUpdateRequest.type() != null) {
            this.type = userUpdateRequest.type();
        }
        if (userUpdateRequest.year() != null) {
            this.year = userUpdateRequest.year();
        }
    }
}
