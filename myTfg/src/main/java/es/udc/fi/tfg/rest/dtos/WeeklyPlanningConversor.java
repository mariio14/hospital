package es.udc.fi.tfg.rest.dtos;

import java.util.*;
import java.util.stream.Collectors;

public class WeeklyPlanningConversor {

    private WeeklyPlanningConversor() {
    }

    public static WeeklyResultDto toWeeklyPlanningDtos(Map<String, Map<Integer, String>> planningMap,
                                                               int year, String month, String week) {
        List<WeeklyPlanningDto> assignations = planningMap.entrySet()
                .stream()
                .map(entry -> toWeeklyPlanningDto(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return new WeeklyResultDto(year, month, week, assignations);
    }

    public static WeeklyResultDto toWeeklyPlanningDtosFromData(Map<String, Map<Integer, String>> planningMap,
                                                               WeeklyDataDto data) {
        List<WeeklyPlanningDto> list = new ArrayList<>();
        for (WeeklyAssignationsDto dto : data.getWeeklyAssignationsDtos()) {
            Map<Integer, String> value = planningMap.get(dto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
            list.add(toWeeklyPlanningDto(dto.getName(), value));
        }
        return new WeeklyResultDto(data.getYear(), data.getMonth(), data.getWeek(), list);
    }

    public static WeeklyPlanningDto toWeeklyPlanningDto(String name, Map<Integer, String> asignations) {
        if (asignations == null) {
            return new WeeklyPlanningDto(name, new HashMap<>());
        }
        return new WeeklyPlanningDto(name, new HashMap<>(asignations));
    }
}
