package com.nuriwoolim.pagebackend.user;

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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
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
    @Builder.Default
    private UserType type = UserType.NONMEMBER;

    @NotNull
    @Builder.Default
    private LocalDate createdDate = LocalDate.now();

    private Integer year;

    @Builder.Default
    private boolean emailVerified = false;

    @OneToMany(mappedBy = "writer", fetch = FetchType.LAZY)
    private List<Post> postList;

    @OneToMany(mappedBy = "writer", fetch = FetchType.LAZY)
    private List<Comment> commentList;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<TimeTable> timeTableList;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<WeekSchedule> weekScheduleList;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Schedule> scheduleList;

    @Builder
    private User(boolean emailVerified, Integer year, LocalDate createdDate, UserType type, String nickname, String password, String email, String username, Long id) {
        this.emailVerified = emailVerified;
        this.year = year;
        this.createdDate = createdDate;
        this.type = type;
        this.nickname = nickname;
        this.password = password;
        this.email = email;
        this.username = username;
        this.id = id;
    }

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
