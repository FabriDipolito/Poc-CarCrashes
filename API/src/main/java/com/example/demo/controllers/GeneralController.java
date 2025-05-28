package com.example.demo.controllers;

import com.example.demo.services.GeneralService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/general")
public class GeneralController {
    private final GeneralService generalService;

    public GeneralController(GeneralService generalService) {
        this.generalService = generalService;
    }

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAllYears() {
        try {
            List<Integer> years = generalService.getAllYears();
            if (years.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(years);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining years:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/total-records")
    public ResponseEntity<Map<String, Integer>> getTotalRecords() {
        try {
            Map<String, Integer> totals = generalService.getTotalRecords();
            return ResponseEntity.ok(totals);
        } catch (Exception e) {
            System.out.println("❌ Error obtaining total records:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
