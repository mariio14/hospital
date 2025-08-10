package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.util.*;

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

    public static String toClingoParams(List<AnnualPlanningDataDto> annualPlanningList, List<Priority> costs) {
        StringBuilder clingoParams = new StringBuilder();

        for (AnnualPlanningDataDto annualPlanningDto : annualPlanningList) {
            String personName = annualPlanningDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            clingoParams.append(String.format("person(%s). ", personName));

            int level = Integer.parseInt(annualPlanningDto.getLevel().replace("R", ""));
            clingoParams.append(String.format("level(%s,%d). ", personName, level));

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
        for (Priority priority: costs) {
            clingoParams.append(String.format("cost(%s,%d). ", priority.getId(), priority.getCost()));
        }
        return clingoParams.toString();
    }

    public static List<Map<String, Map<Integer, String>>> toMap(List<AnnualPlanningDataDto> params) {
        List<Map<String, Map<Integer, String>>> result = new ArrayList<>();
        Map<String, Map<Integer, String>> map = new HashMap<>();
        for (AnnualPlanningDataDto annualPlanningDataDto : params) {
            String personName = annualPlanningDataDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT);
            Map<Integer, String> assignationsMap = new HashMap<>();
            List<String> assignations = annualPlanningDataDto.getAssignations();
            if (assignations != null) {
                for (int i = 0; i < assignations.size(); i++) {
                    String assignation = assignations.get(i);
                    if (assignation != null) {
                        String key = CONSTANTS_MAP.entrySet().stream()
                                .filter(entry -> entry.getValue().equals(assignation))
                                .map(Map.Entry::getKey)
                                .findFirst()
                                .orElse("unknown");
                        assignationsMap.put(i + 1, key);
                    }
                }
            }
            map.put(personName, assignationsMap);
        }
        result.add(map);
        return result;
    }
}
