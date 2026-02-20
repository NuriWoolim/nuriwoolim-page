package com.nuriwoolim.pagebackend.domain.board.repository;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

    boolean existsByTitle(String title);
}
