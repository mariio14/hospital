package es.udc.fi.tfg.rest.dtos;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AnnualPlanningConversor {

    private AnnualPlanningConversor() {
	}

    public static List<AnnualPlanningDto> toAnnualPlanningDtos(Map<Integer, Map<Integer, String>> planningMap) {
        return planningMap.entrySet()
                .stream()
                .map(entry -> new AnnualPlanningDto(entry.getKey().toString(), entry.getValue()))
                .collect(Collectors.toList());
    }
}
