package com.nuriwoolim.pagebackend.domain.board.repository;

import com.nuriwoolim.pagebackend.domain.board.entity.Board;
<<<<<<< HEAD
import com.nuriwoolim.pagebackend.domain.calendar.entity.Calendar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
=======
import org.springframework.data.jpa.repository.JpaRepository;
>>>>>>> 488027a (feat: 게시판 CRUD 구현)

public interface BoardRepository extends JpaRepository<Board, Long> {
    boolean existsByTitle(String title);
}
