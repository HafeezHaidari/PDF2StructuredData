package com.pdfprocessor.service.storage;

import com.pdfprocessor.model.FileAsset;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamSource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private final StorageProperties storageProperties;
    private final Path basePath;

    public LocalStorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
        this.basePath = Paths.get(storageProperties.getLocal().getBasePath()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(basePath);
            log.info("Local storage initialized at: {}", basePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create storage directory", e);
        }
    }

    @Override
    public String storeFile(InputStream inputStream, String originalFilename, String mimeType, long size) throws IOException {
        String storageKey = generateStorageKey(originalFilename);
        Path uploadPath = basePath.resolve(storageKey).normalize();

        // Security check: ensure the path is within basePath
        if (!uploadPath.startsWith(basePath)) {
            throw new SecurityException("Invalid file path");
        }

        // Create parent directories
        Files.createDirectories(uploadPath.getParent());

        // Store file
        Files.copy(inputStream, uploadPath, StandardCopyOption.REPLACE_EXISTING);
        
        log.info("File stored: {} (size: {} bytes)", storageKey, size);
        return storageKey;
    }

    @Override
    public InputStream getFile(String storageKey) throws IOException {
        Path filePath = basePath.resolve(storageKey).normalize();
        
        // Security check
        if (!filePath.startsWith(basePath)) {
            throw new SecurityException("Invalid file path");
        }

        return Files.newInputStream(filePath);
    }

    @Override
    public String getPresignedUrl(String storageKey, int expirationMinutes) {
        // For local storage, generate a download URL that the backend will handle
        return storageProperties.getLocal().getBaseUrl() + storageKey;
    }

    @Override
    public void deleteFile(String storageKey) throws IOException {
        Path filePath = basePath.resolve(storageKey).normalize();
        
        // Security check
        if (!filePath.startsWith(basePath)) {
            throw new SecurityException("Invalid file path");
        }

        Files.deleteIfExists(filePath);
        log.info("File deleted: {}", storageKey);
    }

    private String generateStorageKey(String originalFilename) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String extension = "";
        
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot > 0) {
            extension = originalFilename.substring(lastDot);
        }
        
        String randomPart = java.util.UUID.randomUUID().toString().substring(0, 8);
        return String.format("%s/%s%s", timestamp.substring(0, 6), randomPart + "_" + timestamp, extension);
    }
}