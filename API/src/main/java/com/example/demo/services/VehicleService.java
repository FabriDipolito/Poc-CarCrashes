package com.example.demo.services;

import com.example.demo.DTO.PaginatedResults;
import com.example.demo.DTO.PieChartDataVehicles;
import com.example.demo.DTO.treeMap.TreeMapData;
import com.example.demo.entities.Vehicle;
import com.example.demo.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class VehicleService {

    private final VehicleRepository repository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository) {
        this.repository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }

    public List<Map<String, Object>> getAllUniqueMakes() {
        return repository.findAllUniqueMakes();
    }

    public List<Map<String, Object>> getModelsByMakeId(int makeId) {
        return repository.findModelsByMakeId(makeId);
    }

    public PaginatedResults<Vehicle> getPaginatedVehicles(int page, int size, Integer makeId, Integer modelId) {
        PageRequest pageRequest = PageRequest.of(page, size);
        PaginatedResults<Vehicle> paginatedResult;

        if (makeId != null && modelId != null) {
            paginatedResult = repository.findByMakeIdAndModel(makeId, modelId, page, size);
        } else if (makeId != null) {
            paginatedResult = repository.findByMakeId(makeId, page, size);
        } else if (modelId != null) {
            paginatedResult = repository.findByModel(modelId, page, size);
        } else {
            paginatedResult = repository.findAll(page, size);
        }

        return paginatedResult;
    }

    public List<PieChartDataVehicles> getPieChartData(int startYear, int endYear, String filterType) {
        List<PieChartDataVehicles> data = repository.getPieChartData(startYear, endYear, filterType);

        data.sort((a, b) -> filterType.equals("dangerous") ? b.getValue() - a.getValue() : a.getValue() - b.getValue());

        return data.size() > 10 ? data.subList(0, 10) : data;
    }

    public TreeMapData getTreeMapData(int makeId, String filterType) {
        return repository.getTreeMapData(makeId, filterType);
    }

}
