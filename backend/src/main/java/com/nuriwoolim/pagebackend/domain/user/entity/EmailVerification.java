package com.nuriwoolim.pagebackend.domain.user.entity;

import com.nuriwoolim.pagebackend.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
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
public class EmailVerification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String resendToken;

    @Column(nullable = false)
    @Builder.Default
    private int resendCount = 0;

    private LocalDateTime expiresAt;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public void updateCode(String code) {
        this.code = code;
    }

    public void countResend() {
        this.resendCount++;
    }

    public void setExpiresAt(int minutes) {
        expiresAt = LocalDateTime.now().plusMinutes(minutes);
    }
}





