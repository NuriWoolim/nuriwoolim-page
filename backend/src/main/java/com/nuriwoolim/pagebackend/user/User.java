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
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Getter
@Setter
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
    private boolean email_verified = false;

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

    public static User of(UserCreateRequest userCreateRequest) {
        User user = new User();
        user.setUsername(userCreateRequest.getUsername());
        user.setEmail(userCreateRequest.getEmail());
        user.setPassword(userCreateRequest.getPassword());
        user.setNickname(userCreateRequest.getNickname());

        return user;
    }

    public void update(UserUpdateRequest userUpdateRequest) {
        Optional.ofNullable(userUpdateRequest.getEmail()).ifPresent(this::setEmail);
        Optional.ofNullable(userUpdateRequest.getPassword()).ifPresent(this::setPassword);
        Optional.ofNullable(userUpdateRequest.getNickname()).ifPresent(this::setNickname);
        Optional.ofNullable(userUpdateRequest.getType()).ifPresent(this::setType);
        Optional.ofNullable(userUpdateRequest.getYear()).ifPresent(this::setYear);
    }
}
