package com.ETL.service;

import com.ETL.DB.entities.Accident;
import com.ETL.DB.entities.Vehicle;
import com.ETL.extract.CsvExtractorAccidents;
import com.ETL.extract.CsvExtractorVehicles;
import com.ETL.load.AccidentDataLoader;
import com.ETL.load.VehicleDataLoader;
import com.ETL.transform.AccidentDataTransformer;
import com.ETL.transform.VehicleDataTransformer;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * This service orchestrates the ETL (Extract, Transform, Load) process.
 * It runs automatically when the application starts.
 */
@Service
public class EtlService {

    private final CsvExtractorAccidents accidentExtractor;
    private final CsvExtractorVehicles vehicleExtractor;
    private final AccidentDataTransformer accidentTransformer;
    private final VehicleDataTransformer vehicleTransformer;
    private final AccidentDataLoader accidentLoader;
    private final VehicleDataLoader vehicleLoader;

    @Autowired
    public EtlService(CsvExtractorAccidents accidentExtractor, CsvExtractorVehicles vehiculeExtractor, AccidentDataTransformer accidentTransformer, VehicleDataTransformer vehicleTransformer, AccidentDataLoader accidentLoader, VehicleDataLoader vehicleLoader) {
        this.accidentExtractor = accidentExtractor;
        this.vehicleExtractor = vehiculeExtractor;
        this.accidentTransformer = accidentTransformer;
        this.vehicleTransformer = vehicleTransformer;
        this.accidentLoader = accidentLoader;
        this.vehicleLoader = vehicleLoader;
    }

    @PostConstruct
    public void runEtl() {
        System.out.println("Starting ETL Process...");

        int[] years = {2023};
        int[] states = new int[56];

        // Fill the array with the 52 states (4 ids are not used) (1 a 56)
        for (int i = 0; i < 56; i++) {
            states[i] = i + 1;
        }

        for (int year : years) {
            for (int state : states) {
                // Avoid these ids, because they don't represent a state
                if (state == 3 || state == 7 || state == 14 || state == 52) continue;

                try {
                    System.out.println("Processing state: " + state + ", year: " + year);

                    // 🔹 EXTRACT: Obtein all Accidents Data in CSV files
                    List<Map<String, String>> accidentsRawData = accidentExtractor.extractData(state, year);
                    System.out.println("Extracted " + accidentsRawData.size() + " accident records.");

                    // 🔹 TRANSFORM: Convert all CSV extracted data into Accidents Objects
                    List<Accident> transformedAccidents = accidentTransformer.transformData(accidentsRawData);
                    System.out.println("Transformed " + transformedAccidents.size() + " accident records.");

                    // 🔹 LOADING: Save all transformed Accidents into DataBase
                    accidentLoader.loadData(transformedAccidents);
                    System.out.println("Loaded " + transformedAccidents.size() + " accident records into the database.");

                    // 🔹 EXTRACT and TRANSFORM all data of Accidents to vehicles (they come one at a time in JSON format, from extractor)
                    List<Map<String, String>> vehicleRawData = vehicleExtractor.extractData(transformedAccidents);
                    System.out.println("Extracted " + vehicleRawData.size() + " vehicle records.");
                    List<Vehicle> transformedVehicles = vehicleTransformer.transformData(vehicleRawData);
                    System.out.println("Transformed " + transformedVehicles.size() + " vehicle records.");

                    // 🔹 LOADING vehicles into the DataBase
                    vehicleLoader.loadData(transformedVehicles);
                    System.out.println("Loaded " + transformedVehicles.size() + " vehicle records into the database.");

                } catch (Exception e) {
                    System.err.println("Error processing state: " + state + ", year: " + year);
                    e.printStackTrace();
                    // Continue with the next State and year without interrupting the process
                }
            }
        }

        System.out.println("ETL Process Completed Successfully!");
    }

}
