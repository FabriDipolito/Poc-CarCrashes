package com.example.demo.services;

import com.example.demo.repositories.AccidentRepository;
import com.example.demo.repositories.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeneralService {
    private final AccidentRepository accidentRepository;
    private final VehicleRepository vehicleRepository;

    public GeneralService(AccidentRepository accidentRepository, VehicleRepository vehicleRepository) {
        this.accidentRepository = accidentRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<Integer> getAllYears() {
        return accidentRepository.findAll().stream()
                .map(accident -> {
                    try {
                        return Integer.parseInt(accident.getId().getYear());
                    } catch (NumberFormatException e) {
                        return null;
                    }
                })
                .filter(year -> year != null)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Map<String, Integer> getTotalRecords() {
        int totalAccidents = accidentRepository.findAll().size();
        int totalVehicles = vehicleRepository.findAll().size();

        Map<String, Integer> totals = new HashMap<>();
        totals.put("accidents", totalAccidents);
        totals.put("vehicles", totalVehicles);
        totals.put("total", totalAccidents + totalVehicles);
        return totals;
    }
}

