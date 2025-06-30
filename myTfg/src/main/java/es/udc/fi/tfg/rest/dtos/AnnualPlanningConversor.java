package es.udc.fi.tfg.rest.dtos;

import java.util.*;
import java.util.stream.Collectors;

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

    public static List<AnnualPlanningDto> toAnnualPlanningDtos(Map<String, Map<Integer, String>> planningMap,
                    List<AnnualPlanningDataDto> params) {
        List<AnnualPlanningDto> list = new ArrayList<>();
        for (AnnualPlanningDataDto annualPlanningDataDto : params) {
            Map<Integer, String> value =  planningMap.get(annualPlanningDataDto.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
            list.add(new AnnualPlanningDto(annualPlanningDataDto.getName(), annualPlanningDataDto.getLevel(), transformTasksMap(value)));
        }
        return list;
    }

    private static Map<Integer, String> transformTasksMap(Map<Integer, String> value) {
        Map<Integer, String> result = new HashMap<>();
        for (Map.Entry<Integer, String> e : value.entrySet()) {
            String transformed = CONSTANTS_MAP.getOrDefault(e.getValue(), e.getValue());
            result.put(e.getKey()-1, transformed);
        }
        return result;
    }
}
