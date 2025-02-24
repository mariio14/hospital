package es.udc.fi.tfg.rest.dtos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MonthlyPlanningConversor {

    private MonthlyPlanningConversor() {

    }

    public static MonthlyResultDto toMonthlyPlanningDtos(Map<String, Map<Integer, String>> planningMap,
                                                                 MonthlyDataDto params) {
        List<MonthlyPlanningDto> list = planningMap.entrySet()
                .stream()
                .map(entry -> toMonthlyPlanningDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return new MonthlyResultDto(params.getMonth(), list);
    }

    public static MonthlyPlanningDto toMonthlyPlanningDto(String name, Map<Integer, String> asignations) {
        Map<Integer, String> map = new HashMap<>(asignations);

        return new MonthlyPlanningDto(name, map);
    }
}
