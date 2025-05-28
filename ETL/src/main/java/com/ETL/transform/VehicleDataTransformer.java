package com.ETL.transform;

import com.ETL.DB.entities.Vehicle;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class VehicleDataTransformer {

    public List<Vehicle> transformData(List<Map<String, String>> extractedData) {
        return extractedData.stream().map(record -> {
            Vehicle vehicle = new Vehicle();
            vehicle.setBodyType(Integer.parseInt(record.get("BODY_TYP")));
            vehicle.setBodyTypeName(record.get("BODY_TYPNAME"));
            vehicle.setMakeId(Integer.parseInt(record.get("MAKE")));
            vehicle.setMakeName(record.get("MAKENAME"));
            vehicle.setModel(Integer.parseInt(record.get("MODEL")));
            vehicle.setModelName(record.get("MODELNAME"));
            vehicle.setModelYear(record.get("MOD_YEARNAME"));
            vehicle.setAccidentId(Long.valueOf(record.get("ACCIDENT_ID")));

            return vehicle;
        }).collect(Collectors.toList());
    }
}

