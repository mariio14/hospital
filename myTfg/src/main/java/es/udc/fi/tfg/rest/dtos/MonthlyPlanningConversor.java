package es.udc.fi.tfg.rest.dtos;

import java.util.*;
import java.util.stream.Collectors;

public class MonthlyPlanningConversor {

    private MonthlyPlanningConversor() {

    }

    public static MonthlyResultDto toMonthlyPlanningDtos(Map<String, Map<Integer, String>> planningMap,
                                                                 String month, int numDays) {
        List<MonthlyPlanningDto> list = planningMap.entrySet()
                .stream()
                .map(entry -> toMonthlyPlanningDto(entry.getKey(), entry.getValue(), numDays))
                .collect(Collectors.toList());

        return new MonthlyResultDto(month, list);
    }

    public static MonthlyResultDto toMonthlyPlanningDtosFromData(Map<String, Map<Integer, String>> planningMap,
                                                         MonthlyDataDto monthlyData) {
        List<MonthlyPlanningDto> list = new ArrayList<>();
        for (MonthlyAssignationsDto monthlyAssignationsDto : monthlyData.getMonthlyAssignationsDtos()) {
            Map<Integer, String> value = planningMap.get(monthlyAssignationsDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
            list.add(toMonthlyPlanningDto(monthlyAssignationsDto.getName(), value, monthlyData.getNumberOfDays()));
        }
        return new MonthlyResultDto(monthlyData.getMonth(), list);
    }

    public static MonthlyPlanningDto toMonthlyPlanningDto(String name, Map<Integer, String> asignations, int days) {

        List<String> list = new ArrayList<>(Collections.nCopies(days, null));
        asignations.forEach((key, value) -> list.set(key - 1, value.toUpperCase()));

        return new MonthlyPlanningDto(name, list, days);
    }
}
