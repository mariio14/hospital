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
                .map(entry -> {
                    List<Integer> sortedKeys = entry.getValue().keySet().stream().sorted().toList();
                    return toWeeklyPlanningDto(entry.getKey(), entry.getValue(), sortedKeys);
                })
                .collect(Collectors.toList());

        return new WeeklyResultDto(year, month, week, assignations);
    }

    public static WeeklyResultDto toWeeklyPlanningDtosFromData(Map<String, Map<Integer, String>> planningMap,
                                                               WeeklyDataDto data) {
        List<WeeklyPlanningDto> list = new ArrayList<>();
        for (WeeklyAssignationsDto dto : data.getWeeklyAssignationsDtos()) {
            Map<Integer, String> value = planningMap.get(dto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
            list.add(toWeeklyPlanningDto(dto.getName(), value, data.getDays()));
        }
        return new WeeklyResultDto(data.getYear(), data.getMonth(), data.getWeek(), list);
    }

    public static WeeklyPlanningDto toWeeklyPlanningDto(String name, Map<Integer, String> asignations, List<Integer> days) {

        List<String> list = new ArrayList<>(Collections.nCopies(5, null));
        if (asignations != null) {
            asignations.forEach((key, value) -> {
                int index = days.indexOf(key);
                if (index != -1) {
                    list.set(index, value.toUpperCase());
                }
            });
        }
        return new WeeklyPlanningDto(name, list);
    }
}
