package es.udc.fi.tfg.rest.dtos;

import java.util.List;
import java.util.Locale;
import java.util.Map;

public class AnnualPlanningDataConversor {

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

    public static String toClingoParams(List<AnnualPlanningDataDto> annualPlanningList) {
        StringBuilder clingoParams = new StringBuilder();
        int level = 0;

        for (AnnualPlanningDataDto annualPlanningDto : annualPlanningList) {
            String personName = annualPlanningDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            clingoParams.append(String.format("person(%s). ", personName));
            level ++;
            clingoParams.append(String.format("level(%s,%d). ", personName, (level-1)/3 +1));
            List<String> assignations = annualPlanningDto.getAssignations();

            if (assignations != null) {
                int i = 0;
                for (String assignation : assignations) {
                    i++;
                    if (assignation != null) {
                        String key = CONSTANTS_MAP.entrySet().stream()
                                .filter(entry -> entry.getValue().equals(assignation))
                                .map(Map.Entry::getKey)
                                .findFirst()
                                .orElse("unknown");
                        clingoParams.append(String.format("month_assign(%s,%d,%s). ", personName, i, key));
                    }
                }
            }
        }
        return clingoParams.toString();
    }
}
