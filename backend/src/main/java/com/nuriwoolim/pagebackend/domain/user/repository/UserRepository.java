package com.nuriwoolim.pagebackend.domain.user.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nuriwoolim.pagebackend.domain.user.entity.User;
import com.nuriwoolim.pagebackend.domain.user.entity.UserType;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    Page<User> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Page<User> findByType(UserType type, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.type = :type AND (u.name LIKE %:keyword% OR u.email LIKE %:keyword%)")
    Page<User> findByTypeAndKeyword(@Param("type") UserType type, @Param("keyword") String keyword, Pageable pageable);

	long countByType(UserType type);
}
