package com.ETL.load;

import com.ETL.DB.entities.Accident;
import com.ETL.DB.entities.AccidentId;
import com.ETL.DB.repositories.AccidentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccidentDataLoader {

    private final AccidentRepository repository;

    @Autowired
    public AccidentDataLoader(AccidentRepository repository) {
        this.repository = repository;
    }

    public void loadData(List<Accident> data) {
        // Get the IDs already existing in the database
        Set<AccidentId> existingIds = repository.findAll().stream()
                .map(Accident::getId)
                .collect(Collectors.toSet());

        // Identify duplicate IDs
        Set<AccidentId> newIds = new HashSet<>();
        Set<AccidentId> duplicatedIds = new HashSet<>();

        List<Accident> filteredData = data.stream()
                .filter(accident -> {
                    AccidentId id = accident.getId();
                    if (existingIds.contains(id) || !newIds.add(id)) {
                        duplicatedIds.add(id);
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());

        // Print duplicate IDs in the console
        if (!duplicatedIds.isEmpty()) {
            System.out.println("Duplicate IDs detected: " + duplicatedIds);
        }

        // Save only non-duplicated records
        repository.saveAll(filteredData);
    }
}
