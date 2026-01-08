package com.pdfprocessor.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "file_assets", indexes = {
    @Index(name = "idx_file_assets_user", columnList = "user_id"),
    @Index(name = "idx_file_assets_sha256", columnList = "sha256")
})
@EntityListeners(AuditingEntityListener.class)
@Data
public class FileAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false)
    private String originalName;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String mimeType;

    @NotNull
    @Column(nullable = false)
    private Long size;

    @NotBlank
    @Size(min = 64, max = 64)
    @Column(nullable = false, unique = true)
    private String sha256;

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false, unique = true)
    private String storageKey;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}