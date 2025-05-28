package com.ETL.transform;

import com.ETL.DB.entities.Accident;
import com.ETL.DB.entities.AccidentId;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AccidentDataTransformer {

    public List<Accident> transformData(List<Map<String, String>> extractedData) {

        return extractedData.stream().map(record -> {

            Long caseId = Long.parseLong(record.get("st_case"));

            String crashDate = record.get("crashdate").split(" ")[0];
            String[] dateParts = crashDate.split("/");

            String month = (dateParts[0].length() == 1) ? "0" + dateParts[0] : dateParts[0];
            String day = (dateParts[1].length() == 1) ? "0" + dateParts[1] : dateParts[1];
            String year = dateParts[2].trim().substring(0, 4);
;
            String formattedDate = year + "-" + month + "-" + day;

            AccidentId accidentId = new AccidentId(caseId, year);

            Accident accident = new Accident();
            accident.setId(accidentId);
            accident.setCrashDate(formattedDate);
            accident.setState(Integer.parseInt(record.get("state")));
            accident.setStateName(record.get("statename"));
            accident.setCountyName(record.get("countyname"));
            accident.setTotalVehicles(Integer.parseInt(record.get("totalvehicles")));
            accident.setFatals(Integer.parseInt(record.get("fatals")));
            accident.setPersons(Integer.parseInt(record.get("persons")));
            accident.setPeds(Integer.parseInt(record.get("peds")));

            return accident;
        }).collect(Collectors.toList());
    }
}