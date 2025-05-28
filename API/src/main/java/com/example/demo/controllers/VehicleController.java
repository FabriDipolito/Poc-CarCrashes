package com.example.demo.controllers;

import com.example.demo.DTO.PaginatedResults;
import com.example.demo.DTO.PieChartDataVehicles;
import com.example.demo.DTO.treeMap.TreeMapData;
import com.example.demo.entities.Vehicle;
import com.example.demo.services.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    private final VehicleService service;

    public VehicleController(VehicleService vehicleService) {
        this.service = vehicleService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        try {
            List<Vehicle> vehicles = service.getAllVehicles();
            if (vehicles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining all Vehicles:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/makes")
    public ResponseEntity<List<Map<String, Object>>> getAllUniqueMakes() {
        try {
            List<Map<String, Object>> makes = service.getAllUniqueMakes();
            if (makes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(makes);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining all unique makes:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/models")
    public ResponseEntity<List<Map<String, Object>>> getModelsByMakeId(@RequestParam int makeId) {
        try {
            List<Map<String, Object>> models = service.getModelsByMakeId(makeId);
            if (models.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(models);
        } catch (Exception e) {
            System.out.println("❌ Error fetching models by makeId:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/paginated")
    public ResponseEntity<PaginatedResults<Vehicle>> getPaginatedVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer makeId,
            @RequestParam(required = false) Integer modelId) {
        try {
            PaginatedResults<Vehicle> vehicles = service.getPaginatedVehicles(page, size, makeId, modelId);
            if (vehicles.getArray().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining paginated Vehicles:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/piechart")
    public ResponseEntity<List<PieChartDataVehicles>> getPieChartData(
            @RequestParam int startYear,
            @RequestParam int endYear,
            @RequestParam String filterType) {
        try {
            List<PieChartDataVehicles> data = service.getPieChartData(startYear, endYear, filterType);
            if (data.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining PieChart data:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/treemap")
    public ResponseEntity<TreeMapData> getTreeMapData(
            @RequestParam int makeId,
            @RequestParam String filterType) {
        try {
            TreeMapData data = service.getTreeMapData(makeId, filterType);
            if (data == null || data.getChildren().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining TreeMap data:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
