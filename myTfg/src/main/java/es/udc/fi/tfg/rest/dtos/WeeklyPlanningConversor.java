package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.ActivityAndPlanning;
import es.udc.fi.tfg.model.entities.Staff;

import java.util.*;

public class WeeklyPlanningConversor {

    private WeeklyPlanningConversor() {
    }

    private static final Map<String, Integer> MONTH_TO_NUM = Map.ofEntries(
            Map.entry("ENERO", 1),
            Map.entry("FEBRERO", 2),
            Map.entry("MARZO", 3),
            Map.entry("ABRIL", 4),
            Map.entry("MAYO", 5),
            Map.entry("JUNIO", 6),
            Map.entry("JULIO", 7),
            Map.entry("AGOSTO", 8),
            Map.entry("SEPTIEMBRE", 9),
            Map.entry("OCTUBRE", 10),
            Map.entry("NOVIEMBRE", 11),
            Map.entry("DICIEMBRE", 12)
    );

    private static final Map<String, String> COLORS = Map.ofEntries(
            Map.entry("red", "rojo"),
            Map.entry("yellow", "amarillo"),
            Map.entry("blue", "azul")
    );

    private static final Map<String, String> CONSTANTS_MAP = Map.ofEntries(
            Map.entry("red", "ROJOS"),
            Map.entry("yellow", "AMARILLO"),
            Map.entry("blue", "COLON"),
            Map.entry("pink", "MAMA"),
            Map.entry("purple", "URGENCIAS"),
            Map.entry("green", "PARED"),
            Map.entry("brown", "PROCTO"),
            Map.entry("other", "OTRAS"),
            Map.entry("xray", "RAYOS"),
            Map.entry("rea", "REA"),
            Map.entry("thoracic", "TORACICA"),
            Map.entry("valencia", "VALENCIA"),
            Map.entry("vascular", "VASCULAR"),
            Map.entry("nutrition", "NUTRI")
    );

    public static WeeklyResultDto toWeeklyPlanningDtos(ActivityAndPlanning planningMap,
                                                       int year, String month, String week, List<Staff> staffList) {
        Map<String, Map<Integer, List<String>>> planning = planningMap.getPlanning();
        List<WeeklyPlanningDto> list = new ArrayList<>();
        for (Staff staff : staffList) {
            Map<Integer, List<String>> assignations = planning.get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
            String service = planningMap.getAnnualData().get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT))
                    .get(MONTH_TO_NUM.get(month.toUpperCase(Locale.ROOT)));
            List<Integer> sortedDays = assignations != null ? assignations.keySet().stream().sorted().toList() : new ArrayList<>();
            list.add(toWeeklyPlanningDto(staff.getName(), assignations, service, sortedDays));

        }
        changeColors(planningMap.getActivities());
        return new WeeklyResultDto(year, month, week, list, planningMap.getActivities());
    }

    public static WeeklyResultDto toWeeklyPlanningDtosFromData(Map<String, Map<Integer, List<String>>> planningMap,
                                                               WeeklyDataDto data, Map<String, Map<Integer, String>> yearData) {
        List<WeeklyPlanningDto> list = new ArrayList<>();
        for (WeeklyAssignationsDto dto : data.getWeeklyAssignationsDtos()) {
            Map<Integer, List<String>> value = planningMap.get(dto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
            String service = yearData.get(dto.getName().toLowerCase(Locale.ROOT)).get(MONTH_TO_NUM.get(data.getMonth().toUpperCase()));
            list.add(toWeeklyPlanningDto(dto.getName(), value, service, data.getDays()));
        }
        changeColors(data.getActivities());
        return new WeeklyResultDto(data.getYear(), data.getMonth(), data.getWeek(), list, data.getActivities());
    }

    public static WeeklyPlanningDto toWeeklyPlanningDto(String name, Map<Integer, List<String>> asignations, String service, List<Integer> days) {

        List<String> list = new ArrayList<>(Collections.nCopies(5, null));
        List<String> eveningList = new ArrayList<>(Collections.nCopies(5, null));
        if (asignations != null) {
            asignations.forEach((key, value) -> {
                int index = days.indexOf(key);
                if (index != -1) {
                    for (String val : value) {
                        if (val.startsWith("evening")) {
                            String[] partes = val.replaceFirst("evening", "").split("_");
                            String st = partes[0].toUpperCase() + "_" + COLORS.get(partes[1].toLowerCase(Locale.ROOT));
                            eveningList.set(index, st);
                        } else if (val.startsWith("morning")) {
                            String[] partes = val.replaceFirst("morning", "").split("_");
                            String st = partes[0].toUpperCase() + "_" + COLORS.get(partes[1].toLowerCase(Locale.ROOT));
                            list.set(index, st);
                        } else {
                            list.set(index, val.toUpperCase());
                        }
                    }
                }
            });
        }
        return new WeeklyPlanningDto(name, CONSTANTS_MAP.get(service), list, eveningList);
    }

    public static void changeColors(List<List<ActivityDto>> activities) {
        for (List<ActivityDto> activityList : activities) {
            for (ActivityDto activity : activityList) {
                String color = COLORS.get(activity.getColor().toLowerCase(Locale.ROOT));
                if (color != null) {
                    activity.setColor(color);
                }
            }
        }
    }
}
