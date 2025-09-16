package com.nuriwoolim.pagebackend.domain.user.repository;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    boolean existsByEmail(String email);

    Optional<EmailVerification> findByEmail(String email);

    void deleteByEmail(String email);

    Optional<EmailVerification> findByResendToken(String resendToken);
}
