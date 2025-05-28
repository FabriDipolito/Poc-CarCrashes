package com.example.demo.controllers;

import com.example.demo.services.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> postFeedback(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String message = payload.get("message");

            service.saveFeedback(email, message);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "✅ Feedback submitted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "❌ Error submitting feedback");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}