package com.pdfprocessor.service.storage;

import com.pdfprocessor.model.FileAsset;
import org.springframework.core.io.InputStreamSource;

import java.io.IOException;
import java.io.InputStream;

public interface StorageService {
    
    /**
     * Store a file and return the storage key
     */
    String storeFile(InputStream inputStream, String originalFilename, String mimeType, long size) throws IOException;
    
    /**
     * Retrieve a file as InputStream
     */
    InputStream getFile(String storageKey) throws IOException;
    
    /**
     * Generate a presigned URL for downloading the file
     */
    String getPresignedUrl(String storageKey, int expirationMinutes);
    
    /**
     * Delete a file
     */
    void deleteFile(String storageKey) throws IOException;
    
    /**
     * Get file metadata if available
     */
    default FileAsset.FileMetadata getFileMetadata(String storageKey) {
        return null;
    }
}