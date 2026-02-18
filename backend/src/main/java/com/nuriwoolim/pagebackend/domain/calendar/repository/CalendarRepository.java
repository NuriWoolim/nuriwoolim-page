package com.nuriwoolim.pagebackend.domain.calendar.repository;

import com.nuriwoolim.pagebackend.domain.calendar.entity.Calendar;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {

    @Query("SELECT c FROM Calendar c WHERE c.date >= :from AND c.date <= :to")
    List<Calendar> findBetween(@Param("from") LocalDate from,
        @Param("to") LocalDate to);
}