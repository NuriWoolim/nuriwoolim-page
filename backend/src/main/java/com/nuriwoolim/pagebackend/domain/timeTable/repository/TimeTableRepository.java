package com.nuriwoolim.pagebackend.domain.timeTable.repository;

import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {

}