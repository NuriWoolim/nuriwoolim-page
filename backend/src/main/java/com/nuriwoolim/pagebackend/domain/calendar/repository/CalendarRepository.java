package com.nuriwoolim.pagebackend.domain.calendar.repository;

import com.nuriwoolim.pagebackend.domain.calendar.entity.Calendar;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {

    @Query("SELECT c FROM Calendar c WHERE c.start >= :from AND c.end <= :to")
    List<Calendar> findBetween(@Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to);
}