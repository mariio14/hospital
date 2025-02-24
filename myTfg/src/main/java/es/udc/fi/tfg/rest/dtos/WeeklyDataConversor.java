package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.util.List;
import java.util.Locale;
import java.util.Map;

public class WeeklyDataConversor {
    public static String toClingoParams(WeeklyDataDto weeklyDataDto, List<Priority> costs) {

        StringBuilder clingoParams = new StringBuilder();

        for (Map.Entry<Integer,String> entry : weeklyDataDto.getAssignationsDtos().get(0).getAssignations().entrySet()) {
            clingoParams.append(String.format("day(%d). ", entry.getKey()));
        }

        for (WeeklyAssignationsDto weeklyAssignationsDto : weeklyDataDto.getAssignationsDtos()) {
            String personName = weeklyAssignationsDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            clingoParams.append(String.format("person(%s). ", personName));

            int level = Integer.parseInt(weeklyAssignationsDto.getLevel().replace("R", ""));
            clingoParams.append(String.format("level(%s,%d). ", personName, level));

            Map<Integer, String> assignations = weeklyAssignationsDto.getAssignations();

            if (assignations != null) {
                for (Map.Entry<Integer, String> assignation : assignations.entrySet()) {
                    if (assignation != null) {
                        clingoParams.append(String.format("day_assign(%s,%d,%s). ", personName,
                                assignation.getKey(), assignation.getValue()));
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
