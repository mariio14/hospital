package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class AnnualPlanningDataConversor {

    public static String toClingoParams(List<AnnualPlanningDataDto> annualPlanningList) {
        StringBuilder clingoParams = new StringBuilder();

        for (AnnualPlanningDataDto annualPlanningDto : annualPlanningList) {
            String personName = annualPlanningDto.getName();
            List<String> assignations = annualPlanningDto.getAssignations();

            if (assignations != null) {
                int i = 0;
                for (String assignation : assignations) {
                    i++;
                    if (assignation != null) {
                        clingoParams.append(String.format("month_assign(%s,%d,%s). ", personName, i, assignation));
                    }
                }
            }
        }
        return clingoParams.toString();
    }
}
