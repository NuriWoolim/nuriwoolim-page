package com.nuriwoolim.pagebackend.core.jwt;

import com.nuriwoolim.pagebackend.core.jwt.entity.RefreshToken;
import com.nuriwoolim.pagebackend.domain.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByUser(User user);

    Optional<RefreshToken> findByToken(String token);
}