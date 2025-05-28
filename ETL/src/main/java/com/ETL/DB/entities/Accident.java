package com.ETL.DB.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Accidents")
@Getter
@Setter
@NoArgsConstructor
public class Accident {

    @EmbeddedId
    private AccidentId id;

    private String crashDate;
    private int state;
    private String stateName;
    private String countyName;
    private int totalVehicles;
    private int fatals;
    private int persons;
    private int peds;

    @PrePersist
    @PreUpdate
    private void generateId() {
        if (crashDate != null && id != null) {
            id.setYear(extractYear(crashDate));
        }
    }

    private String extractYear(String crashDate) {
        return crashDate.split("-")[0];
    }
}
