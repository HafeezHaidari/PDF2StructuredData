package com.pdfprocessor.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.storage")
@Getter
@Setter
public class StorageProperties {
    
    private Provider provider = Provider.LOCAL;
    private Local local = new Local();
    private S3 s3 = new S3();
    
    public enum Provider {
        LOCAL, S3
    }
    
    @Getter
    @Setter
    public static class Local {
        private String basePath = "./uploads";
        private String baseUrl = "http://localhost:8080/api/files/download/";
    }
    
    @Getter
    @Setter
    public static class S3 {
        private String bucket;
        private String region;
        private String endpoint; // For S3-compatible services
        private String accessKey;
        private String secretKey;
        private int presignedUrlExpirationMinutes = 10;
    }
}