package com.pdfprocessor.service.pdf;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class JsonConverter {
    
    private final ObjectMapper objectMapper;
    
    public String convert(Map<String, Object> structuredData) throws Exception {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(structuredData);
        } catch (Exception e) {
            log.error("Error converting to JSON", e);
            throw e;
        }
    }
}
