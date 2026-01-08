package com.pdfprocessor.repository;

import com.pdfprocessor.model.UsageLedger;
import com.pdfprocessor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface UsageLedgerRepository extends JpaRepository<UsageLedger, Long> {
    Optional<UsageLedger> findByUserAndDate(User user, LocalDate date);
    
    @Query("SELECT SUM(u.conversionsUsed) FROM UsageLedger u WHERE u.user = :user AND u.date = :date")
    Integer sumConversionsUsedByUserAndDate(User user, LocalDate date);
    
    @Query("SELECT SUM(u.pagesProcessed) FROM UsageLedger u WHERE u.user = :user AND u.date = :date")
    Integer sumPagesProcessedByUserAndDate(User user, LocalDate date);
}