package com.nuriwoolim.pagebackend.user.entity;

import com.nuriwoolim.pagebackend.core.BaseEntity;
import com.nuriwoolim.pagebackend.entity.Comment;
import com.nuriwoolim.pagebackend.entity.Post;
import com.nuriwoolim.pagebackend.entity.Schedule;
import com.nuriwoolim.pagebackend.entity.TimeTable;
import com.nuriwoolim.pagebackend.entity.WeekSchedule;
import com.nuriwoolim.pagebackend.user.dto.UserCreateRequest;
import com.nuriwoolim.pagebackend.user.dto.UserUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

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
