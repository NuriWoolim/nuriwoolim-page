package com.nuriwoolim.pagebackend.domain.user.repository;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    boolean existsByEmail(String email);

    Optional<EmailVerification> findByEmail(String email);

    void deleteByEmail(String email);

    Optional<EmailVerification> findByResendToken(String resendToken);

    @Modifying
    @Query("DELETE FROM EmailVerification e WHERE e.expiresAt < :expirationTime OR e.expiresAt is null ")
    int deleteByExpiresAtBefore(@Param("expirationTime") LocalDateTime expirationTime);
}
