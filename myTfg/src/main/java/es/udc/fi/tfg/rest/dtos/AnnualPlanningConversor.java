package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Staff;

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
                    List<Staff> staffList) {
        List<AnnualResultDto> result = new ArrayList<>();
        for (Map<String, Map<Integer, String>> map : planningMap) {
            List<AnnualPlanningDto> list = new ArrayList<>();
            for (Staff staff : staffList) {
                Map<Integer, String> value = map.get(staff.getName().replace(" ", "_").toLowerCase(Locale.ROOT));
                if (value == null) {
                    value = map.get(staff.getName());
                }
                list.add(new AnnualPlanningDto(staff.getName(), staff.getLevel().toString(), transformTasksMap(value)));
            }
            result.add(new AnnualResultDto(list,isComplete(list)));
        }
        return result;
    }

    private static Map<Integer, String> transformTasksMap(Map<Integer, String> value) {
        Map<Integer, String> result = new HashMap<>();
        if (value != null) {
            for (Map.Entry<Integer, String> e : value.entrySet()) {
                String val = e.getValue();
                String transformed = val == null ? null : CONSTANTS_MAP.getOrDefault(val, val);
                result.put(e.getKey()-1, transformed);
            }
        }
        return result;
    }

    private static boolean isComplete(List<AnnualPlanningDto> list) {
        for (AnnualPlanningDto dto : list) {
            for (Map.Entry<Integer, String> assignation : dto.getAssignations().entrySet()) {
                if (assignation.getValue() != null) {
                    return true;
                }
            }
        }
        return false;
    }
}
