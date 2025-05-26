package com.nuriwoolim.pagebackend.user.repository;

import com.nuriwoolim.pagebackend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
