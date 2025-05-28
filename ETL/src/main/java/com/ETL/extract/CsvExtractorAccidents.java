package com.ETL.extract;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CsvExtractorAccidents {
    private final RestClient restClient;

    public CsvExtractorAccidents(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://crashviewer.nhtsa.dot.gov")
                .build();
    }

    public List<Map<String, String>> extractData(int state, int year) {
        List<Map<String, String>> records = new ArrayList<>();

        String endpoint = String.format("/CrashAPI/crashes/GetCaseList?states=%d&fromYear=%d&toYear=%d&minNumOfVehicles=1&maxNumOfVehicles=6&format=csv",
                state, year, year);
        try {
            records.addAll(fetchCsvData(endpoint, year));
        } catch (Exception e) {
            System.err.println("Error extracting data for state: " + state + ", year: " + year);
            e.printStackTrace();
        }

        return records;
    }


    private List<Map<String, String>> fetchCsvData(String endpoint, int currentYear) {
        List<Map<String, String>> records = new ArrayList<>();

        try {
            var response = this.restClient
                    .get()
                    .uri(endpoint)
                    .header("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7")
                    .header("referer", "https://crashviewer.nhtsa.dot.gov/CrashAPI")
                    .header("sec-ch-ua", "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"")
                    .header("sec-ch-ua-mobile", "?0")
                    .header("sec-ch-ua-platform", "\"Windows\"")
                    .header("sec-fetch-dest", "document")
                    .header("sec-fetch-mode", "navigate")
                    .header("sec-fetch-site", "same-origin")
                    .header("sec-fetch-user", "?1")
                    .retrieve();

            var body = response.body(String.class);
            if (body == null || body.isEmpty()) {
                throw new IOException("The body of the response is empty.");
            }

            var lines = body.split(System.lineSeparator());
            if (lines.length < 2) {
                throw new IOException("The returned CSV data is empty.");
            }

            String[] headers = lines[0].split(",");

            // Validation and correction of crashdate Year
            int crashDateIndex = -1;

            for (int i = 0; i < headers.length; i++) {
                if ("crashDate".equalsIgnoreCase(headers[i].trim())) {
                    crashDateIndex = i;
                    break;
                }
            }

            for (int i = 1; i < lines.length; i++) {
                String[] values = lines[i].split(",");
                Map<String, String> record = new HashMap<>();

                for (int j = 0; j < headers.length; j++) {
                    String value = j < values.length ? values[j] : "";

                    // Validating Crashdate year
                    if (j == crashDateIndex && value.matches("\\d{1,2}/\\d{1,2}/\\d{4}.*")) {
                        String[] dateParts = value.split(" ", 2);
                        String[] dateElements = dateParts[0].split("/");

                        int yearFromCsv;
                        try {
                            yearFromCsv = Integer.parseInt(dateElements[2]);
                        } catch (NumberFormatException e) {
                            yearFromCsv = -1;
                        }

                        // If year is different, the actual year corrects the wrong data
                        if (yearFromCsv != currentYear) {
                            dateElements[2] = String.valueOf(currentYear);
                            value = String.join("/", dateElements) + " " + (dateParts.length > 1 ? dateParts[1] : "");
                        }
                    }

                    record.put(headers[j], value);
                }

                records.add(record);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro extracting data from CSV: " + endpoint, e);
        }

        return records;
    }
}

