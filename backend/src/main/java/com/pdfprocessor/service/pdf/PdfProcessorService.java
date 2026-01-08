package com.pdfprocessor.service.pdf;

import com.pdfprocessor.model.ExtractionJob;
import com.pdfprocessor.model.ExtractionResult;
import com.pdfprocessor.model.enums.ExtractionProfile;
import com.pdfprocessor.model.enums.OutputFormat;
import com.pdfprocessor.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import technology.tabula.*;
import technology.tabula.extractors.BasicExtractionAlgorithm;

import java.io.*;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfProcessorService {

    private final StorageService storageService;
    private final JsonConverter jsonConverter;
    private final CsvConverter csvConverter;
    private final MarkdownConverter markdownConverter;

    public ExtractionJob processPdf(ExtractionJob job) throws Exception {
        log.info("Processing PDF for job {} with profile {}", job.getId(), job.getProfile());
        
        try (InputStream pdfStream = storageService.getFile(job.getFileAsset().getStorageKey())) {
            PDDocument document = Loader.loadPDF(pdfStream.readAllBytes());
            
            job.setPages(document.getNumberOfPages());
            job.setStatus(ExtractionJob.Status.PROCESSING);

            // Extract text
            String text = extractText(document);
            List<Table> tables = extractTables(document);
            
            Map<String, Object> structuredData = structureData(text, tables, job.getProfile());

            // Convert to all requested formats
            for (String formatStr : job.getOutputFormats().split(",")) {
                OutputFormat format = OutputFormat.valueOf(formatStr.trim());
                ExtractionResult result = convertToFormat(job, structuredData, tables, format);
                if (result != null) {
                    job.getResults().add(result);
                }
            }

            job.setStatus(ExtractionJob.Status.COMPLETED);
            log.info("Completed processing job {}", job.getId());
            
        } catch (Exception e) {
            log.error("Error processing PDF for job {}: {}", job.getId(), e.getMessage());
            job.setStatus(ExtractionJob.Status.FAILED);
            job.setError(e.getMessage());
            throw e;
        }
        
        return job;
    }

    private String extractText(PDDocument document) throws IOException {
        PDFTextStripper stripper = new PDFTextStripper();
        return stripper.getText(document);
    }

    private List<Table> extractTables(PDDocument document) throws IOException {
        List<Table> tables = new ArrayList<>();
        ObjectExtractor extractor = new ObjectExtractor(document);
        
        for (int pageIndex = 0; pageIndex < document.getNumberOfPages(); pageIndex++) {
            Page page = extractor.extract(pageIndex + 1);
            BasicExtractionAlgorithm algorithm = new BasicExtractionAlgorithm();
            List<Table> pageTables = algorithm.extract(page);
            tables.addAll(pageTables);
        }
        
        extractor.close();
        return tables;
    }

    private Map<String, Object> structureData(String text, List<Table> tables, ExtractionProfile profile) {
        Map<String, Object> structuredData = new HashMap<>();
        
        switch (profile) {
            case INVOICE:
                structuredData = structureInvoiceData(text, tables);
                break;
            case BANK_STATEMENT:
                structuredData = structureBankStatementData(text, tables);
                break;
            default:
                structuredData = structureGenericData(text, tables);
        }
        
        return structuredData;
    }

    private Map<String, Object> structureGenericData(String text, List<Table> tables) {
        Map<String, Object> data = new HashMap<>();
        data.put("text", text);
        data.put("tables", tables);
        data.put("metadata", Map.of("profile", "generic"));
        return data;
    }

    private Map<String, Object> structureInvoiceData(String text, List<Table> tables) {
        Map<String, Object> data = new HashMap<>();
        data.put("type", "invoice");
        
        // Extract invoice fields using regex patterns
        data.put("invoiceNumber", extractPattern(text, "(?i)(invoice|bill)\\s*(#|no)?\\s*[:]?\\s*([A-Z0-9-]+)"));
        data.put("date", extractPattern(text, "(?i)(date)\\s*[:]?\\s*(\\d{1,2}[/-]\\d{1,2}[/-]\\d{4})"));
        data.put("total", extractPattern(text, "(?i)(total|amount)\\s*[:]?\\s*[$€£]?(\\d+[\\.,]?\\d*)"));
        data.put("vendor", extractPattern(text, "(?i)(from|vendor)\\s*[:]?\\s*(.+)", 2));
        
        data.put("tables", tables);
        return data;
    }

    private Map<String, Object> structureBankStatementData(String text, List<Table> tables) {
        Map<String, Object> data = new HashMap<>();
        data.put("type", "bank_statement");
        
        // Extract transactions from tables
        List<Map<String, String>> transactions = new ArrayList<>();
        for (Table table : tables) {
            for (int row = 0; row < table.getRows().size(); row++) {
                List<RectangularTextContainer> cells = table.getRows().get(row);
                if (cells.size() >= 3) {
                    Map<String, String> transaction = new HashMap<>();
                    transaction.put("date", cells.get(0).getText());
                    transaction.put("description", cells.get(1).getText());
                    transaction.put("amount", cells.get(2).getText());
                    transactions.add(transaction);
                }
            }
        }
        
        data.put("transactions", transactions);
        data.put("accountInfo", extractPattern(text, "(?i)(account|acct)\\s*#?\\s*[:]?\\s*(\\d+)", 1));
        return data;
    }

    private String extractPattern(String text, String pattern, int group) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(text);
        return m.find() ? m.group(group) : "";
    }

    private String extractPattern(String text, String pattern) {
        return extractPattern(text, pattern, 1);
    }

    private ExtractionResult convertToFormat(ExtractionJob job, Map<String, Object> structuredData, 
                                           List<Table> tables, OutputFormat format) throws Exception {
        String content = null;
        String preview = null;
        
        switch (format) {
            case JSON:
                content = jsonConverter.convert(structuredData);
                preview = content.length() > 500 ? content.substring(0, 500) + "..." : content;
                break;
            case CSV:
                content = csvConverter.convert(tables);
                preview = content.length() > 500 ? content.substring(0, 500) + "..." : content;
                break;
            case MARKDOWN:
                content = markdownConverter.convert(structuredData);
                preview = content.length() > 500 ? content.substring(0, 500) + "..." : content;
                break;
        }

        if (content == null) return null;

        // Store result
        String resultKey = "results/" + job.getId() + "/" + format.name().toLowerCase() + ".txt";
        storageService.storeFile(new ByteArrayInputStream(content.getBytes()), 
            format.name() + ".txt", "text/plain", content.length());

        ExtractionResult result = new ExtractionResult();
        result.setJob(job);
        result.setFormat(format);
        result.setContentLocation(resultKey);
        result.setPreviewSnippet(preview);
        
        return result;
    }