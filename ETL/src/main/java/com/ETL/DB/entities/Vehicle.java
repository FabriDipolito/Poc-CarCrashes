package com.ETL.DB.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    private Integer makeId;
    private String makeName;
    private Integer model;
    private String modelName;
    private String modelYear;
    private Integer bodyType;
    private String bodyTypeName;
    private Long accidentId;

    // Value derivated from AccidentId
    private String year;

    @PrePersist
    @PreUpdate
    public void setYearFromAccidentId() {
        if (this.accidentId != null) {
            String accidentIdStr = this.accidentId.toString();
            if (accidentIdStr.length() >= 4) {
                this.year = accidentIdStr.substring(0, 4);
            }
        }
    }
}

