package com.nuriwoolim.pagebackend.domain.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
	boolean existsByTitle(String title);
}
