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

    private static final Map<String, String> PREVIOUS_MONTH = Map.ofEntries(
            Map.entry("ENERO", "DICIEMBRE"),
            Map.entry("FEBRERO", "ENERO"),
            Map.entry("MARZO", "FEBRERO"),
            Map.entry("ABRIL", "MARZO"),
            Map.entry("MAYO", "ABRIL"),
            Map.entry("JUNIO", "MAYO"),
            Map.entry("JULIO", "JUNIO"),
            Map.entry("AGOSTO", "JULIO"),
            Map.entry("SEPTIEMBRE", "AGOSTO"),
            Map.entry("OCTUBRE", "SEPTIEMBRE"),
            Map.entry("NOVIEMBRE", "OCTUBRE"),
            Map.entry("DICIEMBRE", "NOVIEMBRE")
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

    public static List<WeeklyResultDto> toWeeklyPlanningDtos(ActivityAndPlanning planningMap,
                                                       int year, String month, String week,
                                                       List<Staff> staffList, GetWeeklyDataDto dto, boolean yearChanged) {
        List<Map<String, Map<Integer, List<String>>>> planning = planningMap.getPlanning();
        List<WeeklyResultDto> result = new ArrayList<>();
        for (Map<String, Map<Integer, List<String>>> map : planning) {
            List<WeeklyPlanningDto> list = new ArrayList<>();
            for (Staff staff : staffList) {
                Map<Integer, List<String>> assignations = map.get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
                if (assignations == null) {
                    assignations = map.get(staff.getName());
                }
                String service = planningMap.getAnnualData().get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT))
                        .get(MONTH_TO_NUM.get(month.toUpperCase(Locale.ROOT)));
                String servicePrev;
                if (yearChanged) {
                    if (planningMap.getPrevAnnualData() == null || planningMap.getPrevAnnualData().isEmpty()) {
                        servicePrev = null;
                    } else {
                        servicePrev = planningMap.getPrevAnnualData().get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT))
                                .get(MONTH_TO_NUM.get(PREVIOUS_MONTH.get(month.toUpperCase(Locale.ROOT))));
                    }
                } else {
                    servicePrev = planningMap.getAnnualData().get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT))
                            .get(MONTH_TO_NUM.get(PREVIOUS_MONTH.get(month.toUpperCase(Locale.ROOT))));
                }
                list.add(toWeeklyPlanningDto(staff.getName(), assignations, service,servicePrev, dto.getDays()));

            }
            changeColors(planningMap.getActivities());
            result.add(new WeeklyResultDto(year, month, week, list, planningMap.getActivities(), true));
        }
        return result;
    }

    public static List<WeeklyResultDto> toWeeklyPlanningDtosFromData(List<Map<String, Map<Integer, List<String>>>> planningMap,
                                                               WeeklyDataDto data, Map<String, Map<Integer, String>> yearData,
                                                               Map<String, Map<Integer, String>> prevYearData, boolean yearChanged) {
        List<WeeklyResultDto> result = new ArrayList<>();
        for (Map<String, Map<Integer, List<String>>> map : planningMap) {
            List<WeeklyPlanningDto> list = new ArrayList<>();
            for (WeeklyAssignationsDto dto : data.getWeeklyPlanningDtos()) {
                Map<Integer, List<String>> value = map.get(dto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
                if (value == null) {
                    value = map.get(dto.getName());
                }
                String service = yearData.get(dto.getName().toLowerCase(Locale.ROOT)).get(MONTH_TO_NUM.get(data.getMonth().toUpperCase()));

                String servicePrev = yearChanged
                        ? prevYearData.get(dto.getName().toLowerCase(Locale.ROOT)).get(MONTH_TO_NUM.get(PREVIOUS_MONTH.get(data.getMonth().toUpperCase())))
                        : yearData.get(dto.getName().toLowerCase(Locale.ROOT)).get(MONTH_TO_NUM.get(PREVIOUS_MONTH.get(data.getMonth().toUpperCase())));
                list.add(toWeeklyPlanningDto(dto.getName(), value, service, servicePrev, data.getDays()));
            }
            changeColors(data.getActivities());
            result.add(new WeeklyResultDto(data.getYear(), data.getMonth(), data.getWeek(), list, data.getActivities(), true));
        }
        return result;
    }

    public static WeeklyPlanningDto toWeeklyPlanningDto(String name, Map<Integer, List<String>> asignations, String service,
                                                        String servicePrev, List<Integer> days) {

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
                            if (partes.length > 2 && !partes[2].isEmpty() && !partes[2].equals("null")) {
                                st += "_" + partes[2];
                            }
                            eveningList.set(index, st);
                        } else if (val.startsWith("morning")) {
                            String[] partes = val.replaceFirst("morning", "").split("_");
                            String st = partes[0].toUpperCase() + "_" + COLORS.get(partes[1].toLowerCase(Locale.ROOT));
                            if (partes.length > 2 && !partes[2].isEmpty() && !partes[2].equals("null")) {
                                st += "_" + partes[2];
                            }
                            if (list.get(index) != null && st.startsWith("FLOOR_amarillo")) {
                                String[] partesQx = list.get(index).split("_");
                                if (partesQx.length > 2 && !partesQx[2].isEmpty() && !partesQx[2].equals("null")) {
                                    st = "PLANTA/QX_" + partesQx[2];
                                } else {
                                    st = "PLANTA/QX";
                                }
                            } else if (list.get(index) != null && st.startsWith("QX_amarillo")) {
                                if (partes.length > 2 && !partes[2].isEmpty() && !partes[2].equals("null")) {
                                    st = "PLANTA/QX_" + partes[2];
                                } else {
                                    st = "PLANTA/QX";
                                }
                            }
                            list.set(index, st);
                        } else {
                            list.set(index, val.toUpperCase());
                        }
                    }
                }
            });
        }

        List<String> colors = new ArrayList<>(Collections.nCopies(5, null));
        Integer prevDay = 0;
        boolean monthChanged = false;
        for (Integer day : days) {
            if (day < prevDay){
                monthChanged = true;
            }
            prevDay = day;
        }
        String currentColor = monthChanged ? servicePrev : service;
        prevDay = 0;
        int index = 0;
        for(Integer day : days) {
            if (day < prevDay){
                currentColor = service;
            }
            prevDay = day;
            colors.add(index, currentColor == null ? null : CONSTANTS_MAP.get(currentColor));
            index ++;
        }
        return new WeeklyPlanningDto(name, colors, list, eveningList);
    }

    public static void changeColors(List<List<ActivityDto>> activities) {
        for (List<ActivityDto> activityList : activities) {
            for (ActivityDto activity : activityList) {
                String colorToConvert = activity.getColor() == null ? "null" : activity.getColor().toLowerCase(Locale.ROOT);
                String color = COLORS.get(colorToConvert);
                if (color != null) {
                    activity.setColor(color);
                }
            }
        }
    }
}
