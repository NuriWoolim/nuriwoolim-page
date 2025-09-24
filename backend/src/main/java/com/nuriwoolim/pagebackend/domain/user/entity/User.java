package com.nuriwoolim.pagebackend.domain.user.entity;

import com.nuriwoolim.pagebackend.core.BaseEntity;
import com.nuriwoolim.pagebackend.core.jwt.entity.RefreshToken;
import com.nuriwoolim.pagebackend.domain.Comment;
import com.nuriwoolim.pagebackend.domain.Post;
import com.nuriwoolim.pagebackend.domain.Schedule;
import com.nuriwoolim.pagebackend.domain.WeekSchedule;
import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@SQLRestriction("deleted = false")
@Table(
    indexes = {
        @Index(name = "idx_user_email", columnList = "email")
    }
)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Setter
    private UserType type = UserType.NONMEMBER;

    private Integer year;

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
    @Setter
    private RefreshToken refreshToken;

    public void updatePassword(String password) {
        this.password = password;
    }
}
