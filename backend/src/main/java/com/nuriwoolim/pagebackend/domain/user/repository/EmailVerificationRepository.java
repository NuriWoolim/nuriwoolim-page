package com.nuriwoolim.pagebackend.domain.user.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerification;
import com.nuriwoolim.pagebackend.domain.user.entity.EmailVerificationType;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

	Optional<EmailVerification> findByEmailAndType(String email, EmailVerificationType type);

	Optional<EmailVerification> findByEmailAndCodeAndType(String email, String code,
		EmailVerificationType type);

	Optional<EmailVerification> findByEmailAndTypeIn(String email,
		Collection<EmailVerificationType> types);

	List<EmailVerification> findByEmail(String email);

	void deleteByEmail(String email);

	@Modifying
	@Query("DELETE FROM EmailVerification e WHERE e.expiresAt < :expirationTime OR e.expiresAt is null ")
	int deleteByExpiresAtBefore(@Param("expirationTime") LocalDateTime expirationTime);

	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("DELETE FROM EmailVerification e WHERE e.email = :email AND e.type = :type")
	void deleteByEmailAndType(@Param("email") String email, @Param("type") EmailVerificationType type);

	@Modifying(flushAutomatically = true, clearAutomatically = true)
	@Query("DELETE FROM EmailVerification e WHERE e.email = :email AND e.type IN :types")
	void deleteByEmailAndTypeIn(@Param("email") String email, @Param("types") Collection<EmailVerificationType> types);
}
