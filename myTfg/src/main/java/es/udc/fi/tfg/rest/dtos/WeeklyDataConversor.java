package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

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

    public static String toClingoParams(WeeklyDataDto weeklyDataDto, List<Priority> costs,
                     Map<String, Map<Integer, String>> yearData, MonthlyResultDto monthData) {

        StringBuilder clingoParams = new StringBuilder();
        for (Integer day : weeklyDataDto.getDays()) {
            clingoParams.append(String.format("day(%d). ", day));
        }

        for (WeeklyAssignationsDto weeklyAssignationsDto : weeklyDataDto.getWeeklyAssignationsDtos()) {
            String personName = weeklyAssignationsDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            clingoParams.append(String.format("person(%s). ", personName));

            int level = Integer.parseInt(weeklyAssignationsDto.getLevel().replace("R", ""));
            clingoParams.append(String.format("level(%s,%d). ", personName, level));

            List<String> assignations = weeklyAssignationsDto.getAssignations();

            if (assignations != null) {
                int i = 1;
                for (String assignation : assignations) {
                    if (assignation != null) {
                        clingoParams.append(String.format("day_assign(%s,%d,%s). ", personName,
                                i, assignation));
                    }
                    i++;
                }
            }
        }
        for (Priority priority: costs) {
            clingoParams.append(String.format("cost(%s,%d). ", priority.getId(), priority.getCost()));
        }
        for (Map.Entry<String, Map<Integer, String>> entry : yearData.entrySet()) {
            String personName = entry.getKey().replace(" ", "_").toLowerCase(Locale.ROOT);
            String service = entry.getValue().get(MONTH_TO_NUM.get(weeklyDataDto.getMonth().toUpperCase()));
            clingoParams.append(String.format("month_assign(%s,%s). ", personName, service));
        }
        for (MonthlyPlanningDto monthlyPlanningDto : monthData.getMonthlyPlanningDtos()) {
            int i=1;
            for (String assignation : monthlyPlanningDto.getAssignations()) {
                if (weeklyDataDto.getDays().contains(i)) {
                    if (Objects.equals(assignation, "v") || Objects.equals(assignation, "V")) {
                        clingoParams.append(String.format("vacation(%s,%d). ",
                                monthlyPlanningDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT),
                                i));
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
        return clingoParams.toString();
    }
}
