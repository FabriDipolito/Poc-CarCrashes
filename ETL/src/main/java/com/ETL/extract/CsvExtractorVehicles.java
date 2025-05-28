package com.ETL.extract;

import com.ETL.DB.entities.Accident;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CsvExtractorVehicles {
    private final RestClient restClient;

    public CsvExtractorVehicles(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://crashviewer.nhtsa.dot.gov")
                .build();
    }

    public List<Map<String, String>> extractData(List<Accident> accidents) {
        List<Map<String, String>> allRecords = new ArrayList<>();

        for (Accident accident : accidents) {
            String caseYear = accident.getCrashDate().split("-")[0];
            String stateCase = String.valueOf(accident.getId().getCaseId());
            String Accident_id = caseYear + stateCase;
            String state = String.valueOf(accident.getState());

            String endpoint = String.format("/CrashAPI/crashes/GetCaseDetails?stateCase=%s&caseYear=%s&state=%s&format=json", stateCase, caseYear, state);

            try {
                allRecords.addAll(fetchJsonData(endpoint, Accident_id));
            } catch (Exception e) {
                // Manage the record without cutting the process
                System.out.println("Error extracting vehicle data for Accident ID: " + Accident_id + " from endpoint: " + endpoint);
                e.printStackTrace();
            }
        }

        return allRecords;
    }

    private List<Map<String, String>> fetchJsonData(String endpoint, String Accident_id) {

        List<Map<String, String>> records = new ArrayList<>();
        long startTime = System.nanoTime();

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

            var json = new JSONObject(body);
            var results = json.getJSONArray("Results");
            if (results.length() < 1) {
                throw new IOException("The returned CSV data is empty.");
            }

            var crashResultSet = results.getJSONArray(0).getJSONObject(0).getJSONObject("CrashResultSet");
            var vehicles = crashResultSet.getJSONArray("Vehicles");

            for (int i = 0; i < vehicles.length(); i++) {
                var vehicle = vehicles.getJSONObject(i);
                Map<String, String> record = new HashMap<>();
                record.put("BODY_TYP", vehicle.getString("BODY_TYP"));
                record.put("BODY_TYPNAME", vehicle.getString("BODY_TYPNAME"));
                record.put("MAKE", vehicle.getString("MAKE"));
                record.put("MAKENAME", vehicle.getString("MAKENAME"));
                record.put("MODEL", vehicle.getString("MODEL"));
                record.put("MODELNAME", vehicle.getString("MODELNAME"));
                record.put("MOD_YEARNAME", vehicle.getString("MOD_YEARNAME"));
                record.put("ACCIDENT_ID", Accident_id);
                records.add(record);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error extracting data of vehicles from " + endpoint, e);
        }

        long endTime = System.nanoTime();
        long duration = (endTime - startTime) / 1_000_000;
        System.out.println( "Accident id: " + Accident_id + " - Time of execution: " + duration + " ms");

        return records;
    }
}
