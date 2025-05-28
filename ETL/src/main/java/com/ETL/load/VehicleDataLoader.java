package com.ETL.load;

import com.ETL.DB.entities.Vehicle;
import com.ETL.DB.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class VehicleDataLoader {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleDataLoader(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public void loadData(List<Vehicle> vehicles) {
        // Get all the accidentId already existing in the VEHICLES table
        Set<Long> existingAccidentIds = vehicleRepository.findAll().stream()
                .map(Vehicle::getAccidentId)
                .collect(Collectors.toSet());

        // Filter vehicles whose accidentId is not in the VEHICLES table
        List<Vehicle> filteredVehicles = vehicles.stream()
                .filter(vehicle -> !existingAccidentIds.contains(vehicle.getAccidentId()))
                .collect(Collectors.toList());

        // Save only non-duplicated vehicles
        if (!filteredVehicles.isEmpty()) {
            vehicleRepository.saveAll(filteredVehicles);
            System.out.println("They were inserted " + filteredVehicles.size() + " vehicles.");
        } else {
            System.out.println("No new vehicles were found to insert.");
        }
    }
}



