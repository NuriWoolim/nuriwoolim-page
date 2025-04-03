package com.nuriwoolim.pagebackend.user;

import com.nuriwoolim.pagebackend.entity.Comment;
import com.nuriwoolim.pagebackend.entity.Post;
import com.nuriwoolim.pagebackend.entity.Schedule;
import com.nuriwoolim.pagebackend.entity.TimeTable;
import com.nuriwoolim.pagebackend.entity.WeekSchedule;
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
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
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
    private LocalDate createdDate = LocalDate.now();

    private Integer year;

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
}
