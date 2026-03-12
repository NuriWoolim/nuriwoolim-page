package com.nuriwoolim.pagebackend.domain.schedule.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nuriwoolim.pagebackend.domain.schedule.entity.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	@Query("SELECT c FROM Schedule c WHERE c.date >= :from AND c.date <= :to")
	List<Schedule> findBetween(@Param("from") LocalDate from,
		@Param("to") LocalDate to);
}