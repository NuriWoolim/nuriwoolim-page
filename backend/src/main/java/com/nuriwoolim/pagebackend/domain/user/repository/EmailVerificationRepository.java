package com.nuriwoolim.pagebackend.domain.user.repository;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerificationType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByEmailAndType(String email, EmailVerificationType type);

    List<EmailVerification> findByEmail(String email);

    void deleteByEmail(String email);

    @Modifying
    @Query("DELETE FROM EmailVerification e WHERE e.expiresAt < :expirationTime OR e.expiresAt is null ")
    int deleteByExpiresAtBefore(@Param("expirationTime") LocalDateTime expirationTime);
}
