package com.pdfprocessor.model;

import com.pdfprocessor.model.enums.ExtractionProfile;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "extraction_jobs", indexes = {
    @Index(name = "idx_ext_jobs_user", columnList = "user_id"),
    @Index(name = "idx_ext_jobs_status", columnList = "status"),
    @Index(name = "idx_ext_jobs_created", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
public class ExtractionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_asset_id", nullable = false)
    private FileAsset fileAsset;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExtractionProfile profile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column
    private Integer pages;

    @Column(name = "output_formats", nullable = false)
    private String outputFormats; // Comma-separated list

    @Column
    private String error;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column
    private Instant startedAt;

    @Column
    private Instant finishedAt;

    public enum Status {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
}