package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.time.Month;
import java.time.YearMonth;
import java.util.*;

public class WeeklyDataConversor {

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

    private static final Map<String, Month> MONTH_TRANSLATION = Map.ofEntries(
            Map.entry("ENERO", Month.JANUARY),
            Map.entry("FEBRERO", Month.FEBRUARY),
            Map.entry("MARZO", Month.MARCH),
            Map.entry("ABRIL", Month.APRIL),
            Map.entry("MAYO", Month.MAY),
            Map.entry("JUNIO", Month.JUNE),
            Map.entry("JULIO", Month.JULY),
            Map.entry("AGOSTO", Month.AUGUST),
            Map.entry("SEPTIEMBRE", Month.SEPTEMBER),
            Map.entry("OCTUBRE", Month.OCTOBER),
            Map.entry("NOVIEMBRE", Month.NOVEMBER),
            Map.entry("DICIEMBRE", Month.DECEMBER)
    );

    private static final Map<String, String> COLORS = Map.ofEntries(
            Map.entry("rojo", "red"),
            Map.entry("amarillo", "yellow"),
            Map.entry("azul", "blue")
    );

    public static String toClingoParams(WeeklyDataDto weeklyDataDto, List<Priority> costs,
                     Map<String, Map<Integer, String>> yearData, Map<String, Map<Integer, String>> prevYearData,
                                        MonthlyResultDto monthData, int year, String month) {

        StringBuilder clingoParams = new StringBuilder();
        int prevDay;
        int firstDay = weeklyDataDto.getDays().stream().sorted().toList().get(0);
        if (firstDay == 1) {
            Month monthEnum = MONTH_TRANSLATION.get(PREVIOUS_MONTH.get(month.toUpperCase()));
            int year1 = monthEnum == Month.DECEMBER ? year - 1 : year;
            prevDay = YearMonth.of(year1, monthEnum).lengthOfMonth();
        } else {
            prevDay = firstDay - 1;
        }
        for (Integer day : weeklyDataDto.getDays()) {
            clingoParams.append(String.format("day(%d). ", day));
            if (day == 1) {
                clingoParams.append(String.format("prev_day(1, %d). ", prevDay));
            } else {
                clingoParams.append(String.format("prev_day(%d,%d). ", day, day - 1));
            }
        }

        for (WeeklyAssignationsDto weeklyAssignationsDto : weeklyDataDto.getWeeklyPlanningDtos()) {
            String personName = weeklyAssignationsDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            clingoParams.append(String.format("person(%s). ", personName));

            int level = Integer.parseInt(weeklyAssignationsDto.getLevel().replace("R", ""));
            clingoParams.append(String.format("level(%s,%d). ", personName, level));

            if (weeklyAssignationsDto.getAssignations() != null) {
                int i = 0;
                for (String assignation : weeklyAssignationsDto.getAssignations()) {
                    if (assignation != null) {
                        if (assignation.startsWith("PLANTA/QX")) {
                            String[] parts = assignation.split("_");
                            String identifier = (parts.length > 1 && parts[1] != null) ? parts[1].toLowerCase(Locale.ROOT) : null;
                            clingoParams.append(String.format("day_assign(%s,%d,qx,yellow,morning,%s). ", personName, weeklyDataDto.getDays().get(i), identifier));
                            clingoParams.append(String.format("day_assign(%s,%d,floor,yellow,morning,null). ", personName, weeklyDataDto.getDays().get(i)));
                            continue;
                        }
                        String[] partes = assignation.split("_");
                        String tipo = partes[0].toLowerCase(Locale.ROOT);
                        String color = partes.length > 1 ? COLORS.get(partes[1].toLowerCase(Locale.ROOT)) : null;
                        String identifier = (partes.length > 2 && tipo.equals("qx")) ? partes[2].toLowerCase(Locale.ROOT) : null;
                        if (identifier != null) {
                            clingoParams.append(String.format("day_assign(%s,%d,%s,%s,morning,%s). ", personName, weeklyDataDto.getDays().get(i), tipo, color, identifier));
                        } else {
                            clingoParams.append(String.format("day_assign(%s,%d,%s,%s,morning,null). ", personName, weeklyDataDto.getDays().get(i), tipo, color));
                        }
                    }
                    i++;
                }
            }
            if (weeklyAssignationsDto.getEveningAssignations() != null) {
                int i = 0;
                for (String assignation : weeklyAssignationsDto.getEveningAssignations()) {
                    if (assignation != null) {
                        String[] partes = assignation.split("_");
                        String tipo = partes[0].toLowerCase(Locale.ROOT);
                        String color = partes.length > 1 ? COLORS.get(partes[1].toLowerCase(Locale.ROOT)) : null;
                        String identifier = (partes.length > 2 && tipo.equals("qx")) ? partes[2].toLowerCase(Locale.ROOT) : null;
                        if (identifier != null) {
                            clingoParams.append(String.format("day_assign(%s,%d,%s,%s,evening,%s). ", personName, weeklyDataDto.getDays().get(i), tipo, color, identifier));
                        } else {
                            clingoParams.append(String.format("day_assign(%s,%d,%s,%s,evening,null). ", personName, weeklyDataDto.getDays().get(i), tipo, color));
                        }
                    }
                    i++;
                }
            }
        }
        for (Priority priority: costs) {
            switch (priority.getId()) {
                case "semanalP_03" ->
                        clingoParams.append(String.format("cost(semanalP_03_4_5,yellow,%d). ", priority.getCost()));
                case "semanalP_04" ->
                        clingoParams.append(String.format("cost(semanalP_03_4_5,red,%d). ", priority.getCost()));
                case "semanalP_05" ->
                        clingoParams.append(String.format("cost(semanalP_03_4_5,blue,%d). ", priority.getCost()));
                default ->
                        clingoParams.append(String.format("cost(%s,%d). ", priority.getId(), priority.getCost()));
            }
        }
        boolean hasMonthChange = false;
        int prevDay1 = 0;
        for (Integer day : weeklyDataDto.getDays()) {
            if (day < prevDay1) {
                hasMonthChange = true;
                break;
            }
            prevDay1 = day;
        }
        boolean hasYearChange = hasMonthChange && month.equalsIgnoreCase("ENERO");
        prevDay1 = 0;
        boolean change = false;
        for (Integer day : weeklyDataDto.getDays()) {
            if (day < prevDay1) {
                change = true;
            }
            for (Map.Entry<String, Map<Integer, String>> entry : yearData.entrySet()) {
                String personName = entry.getKey().replace(" ", "_").toLowerCase(Locale.ROOT);
                String service = hasMonthChange ? change
                        ? entry.getValue().get(MONTH_TO_NUM.get(weeklyDataDto.getMonth().toUpperCase()))
                        : hasYearChange
                            ? prevYearData.get(personName).get(MONTH_TO_NUM.get(PREVIOUS_MONTH.get(weeklyDataDto.getMonth().toUpperCase())))
                            : entry.getValue().get(MONTH_TO_NUM.get(PREVIOUS_MONTH.get(weeklyDataDto.getMonth().toUpperCase())))
                    : entry.getValue().get(MONTH_TO_NUM.get(weeklyDataDto.getMonth().toUpperCase()));
                clingoParams.append(String.format("month_assign(%s,%d,%s). ", personName, day, service));
            }
        }
        boolean vacation = false;
        for (MonthlyPlanningDto monthlyPlanningDto : monthData.getMonthlyPlanningDtos()) {
            int i=1;
            for (String assignation : monthlyPlanningDto.getAssignations()) {
                if (weeklyDataDto.getDays().contains(i) || i == prevDay) {
                    if (Objects.equals(assignation, "v") || Objects.equals(assignation, "V")) {
                        clingoParams.append(String.format("vacation(%s,%d). ",
                                monthlyPlanningDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT),
                                i));
                        vacation = true;
                    } else if (assignation != null) {
                        clingoParams.append(String.format("day_assign_from_month(%s,%d,%s). ",
                                monthlyPlanningDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT),
                                i, assignation.toLowerCase(Locale.ROOT)));
                        if (assignation.toLowerCase(Locale.ROOT).equals("g") || assignation.toLowerCase(Locale.ROOT).equals("gp")) {
                            clingoParams.append(String.format("day_assign_guard_from_month(%s,%d). ",
                                    monthlyPlanningDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT), i));
                        }
                    }
                }
                i++;
            }
        }
        int act = 0;
        int firstDayOfWeek = weeklyDataDto.getDays().stream().sorted().toList().get(0);
        for (List<ActivityDto> activityDtos : weeklyDataDto.getActivities()) {
            int day = firstDayOfWeek + act;
            for (ActivityDto activityDto : activityDtos) {
                String type = activityDto.getType().toLowerCase(Locale.ROOT);
                String color = activityDto.getColor() == null ? null : COLORS.get(activityDto.getColor());
                int slots = activityDto.getSlots();
                String time = activityDto.getTime();
                String identifier = activityDto.getIdentifier() == null || Objects.equals(activityDto.getIdentifier(), "")
                        ? "null" : activityDto.getIdentifier().toLowerCase(Locale.ROOT);
                if (Objects.equals(time, "morning")) {
                    if (type.equals("qx")) {
                        clingoParams.append(String.format("task_color(qx,%s,%d,%d,%s). ", color, day, slots, identifier));
                    } else if (type.equals("floor")) {
                        clingoParams.append(String.format("task_color(floor,%s,%d,%d). ", color, day, 1));
                    } else {
                        clingoParams.append(String.format("task(%s,%d). ", type, day));
                    }
                } else {
                    if (type.equals("qx")) {
                        clingoParams.append(String.format("task_evening_color(qx,%s,%d,%s). ", color, day, identifier));
                    } else {
                        clingoParams.append(String.format("task_evening(%s,%d). ", type, day));
                    }
                }
            }
            act++;
        }
        if (!vacation) {
            clingoParams.append("vacation(dummyname,1). ");
        }
        return clingoParams.toString();
    }

    public static List<Map<String, Map<Integer, List<String>>>> toMap(WeeklyDataDto weeklyDataDto) {
        List<Map<String, Map<Integer, List<String>>>> result = new ArrayList<>();
        Map<String, Map<Integer, List<String>>> map = new HashMap<>();
        for (WeeklyAssignationsDto weeklyAssignationsDto : weeklyDataDto.getWeeklyPlanningDtos()) {
            String personName = weeklyAssignationsDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            if (weeklyAssignationsDto.getAssignations() != null) {
                int i = 0;
                for (String assignation : weeklyAssignationsDto.getAssignations()) {
                    if (assignation != null) {
                        if (assignation.startsWith("PLANTA/QX")) {
                            String[] parts = assignation.split("_");
                            String identifier = (parts.length > 1 && parts[1] != null) ? parts[1].toLowerCase(Locale.ROOT) : null;
                            if (!map.containsKey(personName)) {
                                map.put(personName, new HashMap<>());
                            }
                            if (!map.get(personName).containsKey(weeklyDataDto.getDays().get(i))) {
                                map.get(personName).put(weeklyDataDto.getDays().get(i), new ArrayList<>());
                            }
                            map.get(personName).get(weeklyDataDto.getDays().get(i)).add(String.format("morningqx_yellow_%s", identifier));
                            map.get(personName).get(weeklyDataDto.getDays().get(i)).add("morningfloor_yellow");
                            continue;
                        }
                        String[] partes = assignation.split("_");
                        String tipo = partes[0].toLowerCase(Locale.ROOT);
                        String color = partes.length > 1 ? COLORS.get(partes[1].toLowerCase(Locale.ROOT)) : null;
                        String identifier = (partes.length > 2 && tipo.equals("qx")) ? partes[2].toLowerCase(Locale.ROOT) : null;
                        if (identifier != null) {
                            if (!map.containsKey(personName)) {
                                map.put(personName, new HashMap<>());
                            }
                            if (!map.get(personName).containsKey(weeklyDataDto.getDays().get(i))) {
                                map.get(personName).put(weeklyDataDto.getDays().get(i), new ArrayList<>());
                            }
                            map.get(personName).get(weeklyDataDto.getDays().get(i)).add(String.format("morning%s_%s_%s", tipo, color, identifier));
                        } else {
                            if (!map.containsKey(personName)) {
                                map.put(personName, new HashMap<>());
                            }
                            if (!map.get(personName).containsKey(weeklyDataDto.getDays().get(i))) {
                                map.get(personName).put(weeklyDataDto.getDays().get(i), new ArrayList<>());
                            }
                            map.get(personName).get(weeklyDataDto.getDays().get(i)).add(String.format("morning%s_%s", tipo, color));
                        }
                    }
                    i++;
                }
            }
            if (weeklyAssignationsDto.getEveningAssignations() != null) {
                int i = 0;
                for (String assignation : weeklyAssignationsDto.getEveningAssignations()) {
                    if (assignation != null) {
                        String[] partes = assignation.split("_");
                        String tipo = partes[0].toLowerCase(Locale.ROOT);
                        String color = partes.length > 1 ? COLORS.get(partes[1].toLowerCase(Locale.ROOT)) : null;
                        String identifier = (partes.length > 2 && tipo.equals("qx")) ? partes[2].toLowerCase(Locale.ROOT) : null;
                        if (identifier != null) {
                            if (!map.containsKey(personName)) {
                                map.put(personName, new HashMap<>());
                            }
                            if (!map.get(personName).containsKey(weeklyDataDto.getDays().get(i))) {
                                map.get(personName).put(weeklyDataDto.getDays().get(i), new ArrayList<>());
                            }
                            map.get(personName).get(weeklyDataDto.getDays().get(i)).add(String.format("evening%s_%s_%s", tipo, color, identifier));
                        } else {
                            if (!map.containsKey(personName)) {
                                map.put(personName, new HashMap<>());
                            }
                            if (!map.get(personName).containsKey(weeklyDataDto.getDays().get(i))) {
                                map.get(personName).put(weeklyDataDto.getDays().get(i), new ArrayList<>());
                            }
                            map.get(personName).get(weeklyDataDto.getDays().get(i)).add(String.format("evening%s_%s", tipo, color));
                        }
                    }
                    i++;
                }
            }
        }
        result.add(map);
        return result;
    }
}
