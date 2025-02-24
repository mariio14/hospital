package es.udc.fi.tfg.rest.dtos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class WeeklyPlanningConversor {

    private WeeklyPlanningConversor() {
    }

    public static WeeklyResultDto toWeeklyPlanningDtos(Map<String, Map<Integer, String>> planningMap,
                                                               String month) {
        List<WeeklyPlanningDto> assignations = planningMap.entrySet()
                .stream()
                .map(entry -> toWeeklyPlanningDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return new WeeklyResultDto(month, assignations);
    }

    public static WeeklyPlanningDto toWeeklyPlanningDto(String name, Map<Integer, String> asignations) {
        Map<Integer, String> map = new HashMap<>(asignations);

        return new WeeklyPlanningDto(name, map);
    }
}
