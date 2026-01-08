package com.pdfprocessor.repository;

import com.pdfprocessor.model.FileAsset;
import com.pdfprocessor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileAssetRepository extends JpaRepository<FileAsset, Long> {
    Optional<FileAsset> findByStorageKey(String storageKey);
    Optional<FileAsset> findByUserAndSha256(User user, String sha256);
    Optional<FileAsset> findBySha256(String sha256);
}