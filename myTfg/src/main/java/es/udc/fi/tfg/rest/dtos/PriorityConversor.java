package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Priority;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PriorityConversor {

    private PriorityConversor() {
    }

    public static List<PriorityGroupDto> toPriorityGroupDtos(Map<String, List<Priority>> priorityMap) {
        List<PriorityGroupDto> list = new ArrayList<>();
        for (Map.Entry<String, List<Priority>> entry : priorityMap.entrySet()) {
            list.add(new PriorityGroupDto(entry.getKey(), toPriorityDtos(entry.getValue())));
        }
        return list;
    }

    public static List<PriorityDto> toPriorityDtos(List<Priority> priorities) {
        return priorities.stream().map(PriorityConversor::toPriorityDto).collect(Collectors.toList());
    }

    public static PriorityDto toPriorityDto(Priority priority) {
        return new PriorityDto(priority.getId(), priority.getTitle(), priority.getCost());
    }
}
