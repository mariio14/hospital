package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.util.List;
import java.util.Locale;

public class MonthlyDataConversor {

    public static String toClingoParams(MonthlyDataDto monthlyDataDto, List<Priority> costs) {
        StringBuilder clingoParams = new StringBuilder();

        for (int i=1; i<=monthlyDataDto.getNumberOfDays(); i++) {
            clingoParams.append(String.format("day(%d). ", i));
        }

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
                        clingoParams.append(String.format("day_assign(%s,%d,%s). ", personName, i, assignation));
                    }
                }
            }
        }
        for (Priority priority: costs) {
            clingoParams.append(String.format("cost(%s,%d). ", priority.getId(), priority.getCost()));
        }
        return clingoParams.toString();
    }
}
