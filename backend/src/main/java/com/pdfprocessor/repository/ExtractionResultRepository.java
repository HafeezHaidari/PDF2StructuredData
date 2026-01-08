package com.pdfprocessor.repository;

import com.pdfprocessor.model.ExtractionJob;
import com.pdfprocessor.model.ExtractionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExtractionResultRepository extends JpaRepository<ExtractionResult, Long> {
    List<ExtractionResult> findByJob(ExtractionJob job);
}