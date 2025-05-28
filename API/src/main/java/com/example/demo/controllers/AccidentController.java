package com.example.demo.controllers;

import com.example.demo.DTO.PaginatedResults;
import com.example.demo.entities.Accident;
import com.example.demo.services.AccidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accidents")
public class AccidentController {
    private final AccidentService service;

    public AccidentController(AccidentService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Accident>> getAllAccidents() {
        try {
            List<Accident> accidents = service.getAllAccidents();
            if (accidents.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(accidents);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining all accidents:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/paginated")
    public ResponseEntity<PaginatedResults<Accident>> getPaginatedAccidents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer filterByStateId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            PaginatedResults<Accident> accidents = service.getPaginatedAccidents(page, size, filterByStateId, startDate, endDate);
            if (accidents.getArray().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(accidents);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining paginated Accidents:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/piechart")
    public ResponseEntity<Map<String, Object>> getAccidents(
            @RequestParam int startYear,
            @RequestParam int endYear,
            @RequestParam String filterType) {
        try {
            Map<String, Object> response = service.getAccidentsByYearAndType(startYear, endYear, filterType);
            if (response.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining pie chart data:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/areachart")
    public ResponseEntity<Map<String, Object>> getAccidentsByState(
            @RequestParam int stateId) {
        try {
            Map<String, Object> response = service.getAccidentsByState(stateId);
            if (response.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining area chart data:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



}
