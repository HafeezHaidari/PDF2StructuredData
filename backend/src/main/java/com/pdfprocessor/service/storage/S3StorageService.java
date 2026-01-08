package com.pdfprocessor.service.storage;

import com.pdfprocessor.model.FileAsset;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "s3")
public class S3StorageService implements StorageService {

    private final StorageProperties storageProperties;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final String bucket;

    public S3StorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
        this.bucket = storageProperties.getS3().getBucket();

        S3ClientBuilder builder = S3Client.builder()
            .region(Region.of(storageProperties.getS3().getRegion()));

        if (storageProperties.getS3().getEndpoint() != null && !storageProperties.getS3().getEndpoint().isEmpty()) {
            builder = builder.endpointOverride(java.net.URI.create(storageProperties.getS3().getEndpoint()));
        }

        if (storageProperties.getS3().getAccessKey() != null && !storageProperties.getS3().getAccessKey().isEmpty()) {
            AwsBasicCredentials credentials = AwsBasicCredentials.create(
                storageProperties.getS3().getAccessKey(),
                storageProperties.getS3().getSecretKey()
            );
            builder.credentialsProvider(StaticCredentialsProvider.create(credentials));
        }

        this.s3Client = builder.build();
        this.s3Presigner = S3Presigner.create();

        // Ensure bucket exists
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
            log.info("S3 storage initialized for bucket: {}", bucket);
        } catch (NoSuchBucketException e) {
            log.error("S3 bucket {} does not exist", bucket);
            throw new RuntimeException("S3 bucket not found: " + bucket, e);
        }
    }

    @Override
    public String storeFile(InputStream inputStream, String originalFilename, String mimeType, long size) throws IOException {
        String storageKey = generateStorageKey(originalFilename);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(storageKey)
            .contentType(mimeType)
            .contentLength(size)
            .metadata(java.util.Map.of("originalFilename", originalFilename))
            .build();

        s3Client.putObject(putObjectRequest, 
            software.amazon.awssdk.core.sync.RequestBody.fromInputStream(inputStream, size));

        log.info("File stored in S3: {} (size: {} bytes)", storageKey, size);
        return storageKey;
    }

    @Override
    public InputStream getFile(String storageKey) throws IOException {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucket)
            .key(storageKey)
            .build();

        return s3Client.getObject(getObjectRequest);
    }

    @Override
    public String getPresignedUrl(String storageKey, int expirationMinutes) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucket)
            .key(storageKey)
            .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .getObjectRequest(getObjectRequest)
            .signatureDuration(Duration.ofMinutes(expirationMinutes))
            .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    @Override
    public void deleteFile(String storageKey) throws IOException {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
            .bucket(bucket)
            .key(storageKey)
            .build();

        s3Client.deleteObject(deleteObjectRequest);
        log.info("File deleted from S3: {}", storageKey);
    }

    private String generateStorageKey(String originalFilename) {
        String timestamp = String.valueOf(Instant.now().toEpochMilli());
        String extension = "";

        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot > 0) {
            extension = originalFilename.substring(lastDot);
        }

        String randomPart = java.util.UUID.randomUUID().toString().substring(0, 8);
        return String.format("%s/%s%s", timestamp.substring(0, 6), randomPart + "_" + timestamp, extension);
    }
}