package es.udc.fi.tfg.rest.dtos;

import java.util.*;
import java.util.stream.Collectors;

public class MonthlyPlanningConversor {

    private MonthlyPlanningConversor() {

    }

    public static MonthlyResultDto toMonthlyPlanningDtos(Map<String, Map<Integer, String>> planningMap,
                                                                 MonthlyDataDto params) {
        List<MonthlyPlanningDto> list = planningMap.entrySet()
                .stream()
                .map(entry -> toMonthlyPlanningDto(entry.getKey(), entry.getValue(),
                        params.getNumberOfDays()))
                .collect(Collectors.toList());

        return new MonthlyResultDto(params.getMonth(), list);
    }

    public static MonthlyPlanningDto toMonthlyPlanningDto(String name, Map<Integer, String> asignations, int days) {

        List<String> list = new ArrayList<>(Collections.nCopies(days, null));
        asignations.forEach((key, value) -> list.set(key - 1, value.toUpperCase()));

        return new MonthlyPlanningDto(name, list);
    }
}
