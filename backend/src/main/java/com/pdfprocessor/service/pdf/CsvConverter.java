package com.pdfprocessor.service.pdf;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import technology.tabula.RectangularTextContainer;
import technology.tabula.Table;

import java.io.StringWriter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CsvConverter {
    
    public String convert(Table table) {
        if (table == null) {
            return "";
        }
        
        StringWriter writer = new StringWriter();
        
        try {
            // Write rows
            for (int i = 0; i < table.getRows().size(); i++) {
                List<RectangularTextContainer> cells = table.getRows().get(i);
                String row = cells.stream()
                        .map(cell -> "\"" + cell.getText().replace("\"", "\"\"") + "\"")
                        .collect(Collectors.joining(","));
                writer.write(row);
                writer.write("\n");
            }
        } catch (Exception e) {
            log.error("Error converting table to CSV", e);
        }
        
        return writer.toString();
    }
    
    public String convert(List<Table> tables) {
        if (tables == null || tables.isEmpty()) {
            return "";
        }
        
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < tables.size(); i++) {
            if (i > 0) {
                result.append("\n\n"); // Separate multiple tables
            }
            result.append("# Table ").append(i + 1).append("\n");
            result.append(convert(tables.get(i)));
        }
        
        return result.toString();
    }
}