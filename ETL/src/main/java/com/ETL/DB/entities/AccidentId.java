package com.ETL.DB.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AccidentId implements Serializable {
    private Long caseId;
    private String year;
}