package com.nuriwoolim.pagebackend.domain.timeTable.repository;

import com.nuriwoolim.pagebackend.domain.timeTable.entity.TimeTable;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {

    @Query("SELECT t FROM TimeTable t JOIN FETCH t.user WHERE t.start >= :from AND t.end <= :to")
    List<TimeTable> findBetween(@Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to);

    @Query("""
                SELECT COUNT(t) > 0 FROM TimeTable t WHERE
                (t.start < :to AND t.end > :from)
                AND (t.id != :excludeId OR :excludeId is null)
        """)
    boolean existsTimeTableBetweenExcludingId(@Param("excludeId") Long excludeId,
        @Param("from") LocalDateTime from,
        @Param("to") LocalDateTime to);
}