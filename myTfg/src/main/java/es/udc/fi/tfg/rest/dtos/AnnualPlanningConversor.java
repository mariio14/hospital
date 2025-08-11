package es.udc.fi.tfg.rest.dtos;

import java.util.*;

public class AnnualPlanningConversor {

    private AnnualPlanningConversor() {
	}

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

    public static List<AnnualResultDto> toAnnualPlanningDtos(List<Map<String, Map<Integer, String>>> planningMap,
                    AnnualDataDto params) {
        List<AnnualResultDto> result = new ArrayList<>();
        for (Map<String, Map<Integer, String>> map : planningMap) {
            List<AnnualPlanningDto> list = new ArrayList<>();
            for (AnnualPlanningDataDto annualPlanningDataDto : params.getAssignations()) {
                Map<Integer, String> value = map.get(annualPlanningDataDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
                list.add(new AnnualPlanningDto(annualPlanningDataDto.getName(), annualPlanningDataDto.getLevel(), transformTasksMap(value)));
            }
            result.add(new AnnualResultDto(list,true));
        }
        return result;
    }

    private static Map<Integer, String> transformTasksMap(Map<Integer, String> value) {
        Map<Integer, String> result = new HashMap<>();
        for (Map.Entry<Integer, String> e : value.entrySet()) {
            String val = e.getValue();
            String transformed = val == null ? null : CONSTANTS_MAP.getOrDefault(val, val);
            result.put(e.getKey()-1, transformed);
        }
        return result;
    }
}
