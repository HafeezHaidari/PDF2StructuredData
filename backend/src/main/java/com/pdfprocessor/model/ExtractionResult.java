package com.pdfprocessor.model;

import com.pdfprocessor.model.enums.OutputFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "extraction_results", indexes = {
    @Index(name = "idx_ext_results_job", columnList = "job_id")
})
@EntityListeners(AuditingEntityListener.class)
@Data
public class ExtractionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private ExtractionJob job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OutputFormat format;

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false)
    private String contentLocation;

    @Column(columnDefinition = "TEXT")
    private String previewSnippet;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}