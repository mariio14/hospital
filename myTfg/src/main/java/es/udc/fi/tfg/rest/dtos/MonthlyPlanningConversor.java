package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Staff;

import java.util.*;

public class MonthlyPlanningConversor {

    private MonthlyPlanningConversor() {

    }

    public static List<MonthlyResultDto> toMonthlyPlanningDtos(List<Map<String, Map<Integer, String>>> planningMap,
                                                         String month, int numDays, List<Staff> staffList) {
        List<MonthlyResultDto> monthlyResultDtos = new ArrayList<>();
        for (Map<String, Map<Integer, String>> map : planningMap) {
            List<MonthlyPlanningDto> list = new ArrayList<>();
            for (Staff staff : staffList) {
                Map<Integer, String> assignations = map.get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
                if (assignations == null) {
                    assignations = map.get(staff.getName());
                }
                list.add(toMonthlyPlanningDto(staff.getName(), assignations, numDays));
            }
            monthlyResultDtos.add(new MonthlyResultDto(month, list, true));
        }
        return monthlyResultDtos;
    }

    public static List<MonthlyResultDto> toMonthlyPlanningDtosFromData(List<Map<String, Map<Integer, String>>> planningMap,
                                                         String month, int numDays, List<Staff> staffList) {
        List<MonthlyResultDto> monthlyResultDtos = new ArrayList<>();
        for (Map<String, Map<Integer, String>> map : planningMap) {
            List<MonthlyPlanningDto> list = new ArrayList<>();
            for (Staff staff : staffList) {
                Map<Integer, String> value = map.get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
                if (value == null) {
                    value = map.get(staff.getName());
                }
                list.add(toMonthlyPlanningDto(staff.getName(), value, numDays));
            }
            monthlyResultDtos.add(new MonthlyResultDto(month, list, true));
        }
        return monthlyResultDtos;
    }

    public static MonthlyPlanningDto toMonthlyPlanningDto(String name, Map<Integer, String> asignations, int days) {

        List<String> list = new ArrayList<>(Collections.nCopies(days, null));
        if (asignations != null) {
            asignations.forEach((key, value) -> list.set(key - 1, value.toUpperCase()));
        }

        return new MonthlyPlanningDto(name, list, days);
    }
}
