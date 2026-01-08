package com.pdfprocessor.repository;

import com.pdfprocessor.model.ExtractionJob;
import com.pdfprocessor.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ExtractionJobRepository extends JpaRepository<ExtractionJob, Long> {
    
    Page<ExtractionJob> findByUser(User user, Pageable pageable);
    
    List<ExtractionJob> findByStatusAndCreatedAtBefore(ExtractionJob.Status status, Instant createdAt);
    
    @Query("SELECT COUNT(j) FROM ExtractionJob j WHERE j.user = :user AND j.finishedAt >= :since")
    Long countByUserAndFinishedAtAfter(@Param("user") User user, @Param("since") Instant since);
    
    @Query("SELECT COUNT(j) FROM ExtractionJob j WHERE j.user = :user AND DATE(j.createdAt) = CURRENT_DATE")
    Long countTodayConversions(@Param("user") User user);
    
    @Query(value = "SELECT COUNT(*) FROM extraction_jobs j WHERE j.user_id = :userId AND DATE(j.created_at) = CURRENT_DATE", 
           nativeQuery = true)
    Integer countTodayConversionsNative(@Param("userId") Long userId);
}