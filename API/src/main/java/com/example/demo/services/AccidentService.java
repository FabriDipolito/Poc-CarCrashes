package com.example.demo.services;

import com.example.demo.DTO.PaginatedResults;
import com.example.demo.entities.Accident;

import com.example.demo.repositories.AccidentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AccidentService {
    private final AccidentRepository repository;

    private static final DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter dbFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public AccidentService(AccidentRepository repository) {
        this.repository = repository;
    }

    public List<Accident> getAllAccidents() {
        return repository.findAll();
    }

    public PaginatedResults<Accident> getPaginatedAccidents(int page, int size, Integer filterByStateId, String startDate, String endDate) {
        PageRequest pageRequest = PageRequest.of(page, size);
        PaginatedResults<Accident> paginatedResult;

        LocalDate start = (startDate == null || startDate.isEmpty())
                ? LocalDate.of(2010, 1, 1)
                : LocalDate.parse(startDate, inputFormatter);

        LocalDate end = (endDate == null || endDate.isEmpty())
                ? LocalDate.now()
                : LocalDate.parse(endDate, inputFormatter);

        java.sql.Date startSqlDate = java.sql.Date.valueOf(start);
        java.sql.Date endSqlDate = java.sql.Date.valueOf(end);

        if (filterByStateId != null) {
            paginatedResult = repository.findByStateAndCrashDateBetween(filterByStateId, startSqlDate.toString(), endSqlDate.toString(), page, size);
        } else {
            paginatedResult = repository.findByCrashDateBetween(startSqlDate.toString(), endSqlDate.toString(), page, size);
        }

        return paginatedResult;
    }

    public Map<String, Object> getAccidentsByYearAndType(int startYear, int endYear, String filterType) {
        List<Map<String, Object>> data = repository.findAccidentsByYearRange(startYear, endYear);

        data.sort((a, b) -> {
            int valueA = a.get("value") instanceof Number ? ((Number) a.get("value")).intValue() : 0;
            int valueB = b.get("value") instanceof Number ? ((Number) b.get("value")).intValue() : 0;

            return filterType.equalsIgnoreCase("dangerous")
                    ? Integer.compare(valueB, valueA)
                    : Integer.compare(valueA, valueB);
        });

        List<Map<String, Object>> top10 = data.stream()
                .limit(10)
                .collect(Collectors.toList());

        int total = top10.stream()
                .mapToInt(item -> item.get("value") instanceof Number ? ((Number) item.get("value")).intValue() : 0)
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("array", top10);
        response.put("total", total);

        return response;
    }

    public Map<String, Object> getAccidentsByState(int stateId) {
        List<Map<String, Object>> data = repository.findAccidentsByState(stateId);

        List<Map<String, Object>> areaGraphData = data.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", row.get("year"));
                    map.put("total", row.get("total"));
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("array", areaGraphData);

        return response;
    }

}
