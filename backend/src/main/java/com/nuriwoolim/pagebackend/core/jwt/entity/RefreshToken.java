package com.nuriwoolim.pagebackend.core.jwt.entity;

import com.nuriwoolim.pagebackend.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        indexes = {
                @Index(name = "idx_refreshToken_user", columnList = "user_id"),
        }
)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false, nullable = false)
    private String token;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime issuedAt;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            nullable = false,
            foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT),
            unique = true
    )
    private User user;

    @Builder
    public RefreshToken(String token, User user) {
        this.token = token;
        this.user = user;
    }
}
