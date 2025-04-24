package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

public class MonthlyDataConversor {

    public static String toClingoParams(MonthlyDataDto monthlyDataDto, List<Priority> costs,
                                        Map<String, Map<Integer, String>> previousMonthPlanning) {
        StringBuilder clingoParams = new StringBuilder();

        for (int i=1; i<=monthlyDataDto.getNumberOfDays(); i++) {
            clingoParams.append(String.format("day(%d). ", i));
            clingoParams.append(String.format("numDays(%d). ", monthlyDataDto.getNumberOfDays()));
            clingoParams.append(String.format("numLocations(%d). ", monthlyDataDto.getNumberOfDays()*2));
        }

        for (Integer weekend : monthlyDataDto.getWeekends()) {
            clingoParams.append(String.format("weekend(%d). ", weekend));
            clingoParams.append(String.format("weekend_day(%d,%d). ", weekend, weekend));
            clingoParams.append(String.format("weekend_day(%d,%d). ", weekend, weekend+1));
            clingoParams.append(String.format("weekend_day(%d,%d). ", weekend, weekend+2));
        }

        for (Integer festivo : monthlyDataDto.getFestivos()) {
            clingoParams.append(String.format("holiday(%d). ", festivo));
        }

        boolean vacation = false;
        for (MonthlyAssignationsDto monthlyAssignationsDto : monthlyDataDto.getMonthlyAssignationsDtos()) {
            String personName = monthlyAssignationsDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            clingoParams.append(String.format("person(%s). ", personName));

            int level = Integer.parseInt(monthlyAssignationsDto.getLevel().replace("R", ""));
            clingoParams.append(String.format("level(%s,%d). ", personName, level));

            List<String> assignations = monthlyAssignationsDto.getAssignations();

            if (assignations != null) {
                int i = 0;
                for (String assignation : assignations) {
                    i++;
                    if (assignation != null) {
                        if (assignation.equals("v") || assignation.equals("V")) {
                            clingoParams.append(String.format("vacation(%s,%d). ", personName, i));
                            vacation = true;
                        } else
                            clingoParams.append(String.format("day_assign(%s,%d,%s). ", personName, i, assignation.toLowerCase()));
                    }
                }
            }
        }
        if (!vacation) {
            clingoParams.append("vacation(dummyname,0). ");
        }
        for (Priority priority: costs) {
            clingoParams.append(String.format("cost(%s,%d). ", priority.getId(), priority.getCost()));
        }

        for (int i= monthlyDataDto.getFirstFriday(); i< monthlyDataDto.getNumberOfDays(); i+=7) {
            clingoParams.append(String.format("weekend(%d). ", i));
            clingoParams.append(String.format("weekend_day(%d,%d). ", i, i));
            clingoParams.append(String.format("weekend_day(%d,%d). ", i, i+1));
            clingoParams.append(String.format("weekend_day(%d,%d). ", i, i+2));
        }

        if (Objects.equals(monthlyDataDto.getFirstDay(), "S")) {
            clingoParams.append("weekend(0). ");
            for (Map.Entry<String, Map<Integer, String>> entry : previousMonthPlanning.entrySet()) {
                String person = entry.getKey();
                Map<Integer, String> schedule = entry.getValue();
                Integer size = schedule.size();

                if (schedule.containsKey(size) && schedule.get(size) != null &&
                        (Objects.equals(schedule.get(size), "g") || Objects.equals(schedule.get(size), "gp")
                                || Objects.equals(schedule.get(size), "i") || Objects.equals(schedule.get(size), "e"))) {
                    clingoParams.append(String.format("day_assign(%s,0,%s). ", person, schedule.get(size)));
                }
            }
        } else if (Objects.equals(monthlyDataDto.getFirstDay(), "D")) {
            clingoParams.append("weekend(-1). ");
            for (Map.Entry<String, Map<Integer, String>> entry : previousMonthPlanning.entrySet()) {
                String person = entry.getKey();
                Map<Integer, String> schedule = entry.getValue();
                int size = schedule.size();

                if (schedule.containsKey(size) && schedule.get(size) != null &&
                        (Objects.equals(schedule.get(size), "g") || Objects.equals(schedule.get(size), "gp")
                                || Objects.equals(schedule.get(size), "i") || Objects.equals(schedule.get(size), "e"))) {
                    clingoParams.append(String.format("day_assign(%s,0,%s). ", person, schedule.get(size)));
                }
                if (schedule.containsKey(size-1) && schedule.get(size-1) != null &&
                        (Objects.equals(schedule.get(size-1), "g") || Objects.equals(schedule.get(size-1), "gp")
                                || Objects.equals(schedule.get(size-1), "i") || Objects.equals(schedule.get(size-1), "e"))) {
                    clingoParams.append(String.format("day_assign(%s,0,%s). ", person, schedule.get(size-1)));
                }
            }
        } else {
            for (Map.Entry<String, Map<Integer, String>> entry : previousMonthPlanning.entrySet()) {
                String person = entry.getKey();
                Map<Integer, String> schedule = entry.getValue();
                Integer size = schedule.size();

                if (schedule.containsKey(size) && schedule.get(size) != null &&
                        (Objects.equals(schedule.get(size), "g") || Objects.equals(schedule.get(size), "gp"))) {
                    clingoParams.append(String.format("day_assign(%s,0,%s). ", person, schedule.get(size)));
                }
            }
        }

        return clingoParams.toString();
    }
}
