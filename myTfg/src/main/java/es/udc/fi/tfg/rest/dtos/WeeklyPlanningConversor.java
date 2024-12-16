package es.udc.fi.tfg.rest.dtos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class WeeklyPlanningConversor {

    private WeeklyPlanningConversor() {
    }

    public static List<WeeklyPlanningDto> toWeeklyPlanningDtos(Map<String, Map<Integer, String>> planningMap) {
        return planningMap.entrySet()
                .stream()
                .map(entry -> toWeeklyPlanningDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public static WeeklyPlanningDto toWeeklyPlanningDto(String name, Map<Integer, String> asignations) {
        Map<String, String> map = new HashMap<>();
        for (Map.Entry<Integer, String> entry : asignations.entrySet()) {
            map.put(entry.getKey().toString(), entry.getValue());
        }

        WeeklyPlanningDto weeklyPlanningDto = new WeeklyPlanningDto(name, map);
        return weeklyPlanningDto;
    }
}
