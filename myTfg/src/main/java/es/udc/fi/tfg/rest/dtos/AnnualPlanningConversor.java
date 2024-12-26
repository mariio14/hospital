package es.udc.fi.tfg.rest.dtos;

import java.util.List;
import java.util.Map;
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

    public static List<AnnualPlanningDto> toAnnualPlanningDtos(Map<String, Map<Integer, String>> planningMap) {
        return planningMap.entrySet()
                .stream()
                .map(entry -> {
                    Map<Integer, String> transformedValues = entry.getValue().entrySet()
                            .stream()
                            .collect(Collectors.toMap(
                                    e -> e.getKey() - 1,
                                    e -> CONSTANTS_MAP.getOrDefault(e.getValue(), e.getValue())
                            ));
                    return new AnnualPlanningDto(entry.getKey(), transformedValues);
                })
                .collect(Collectors.toList());
    }
}
