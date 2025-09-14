package com.nuriwoolim.pagebackend.domain.post.repository;

import com.nuriwoolim.pagebackend.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository  extends JpaRepository<Post, Long> {
}
