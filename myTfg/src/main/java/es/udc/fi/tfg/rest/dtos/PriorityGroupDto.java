package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class PriorityGroupDto {

    private String type;

    private List<PriorityDto> priorities;

    public PriorityGroupDto() {
    }

    public PriorityGroupDto(String type, List<PriorityDto> priorities) {
        this.type = type;
        this.priorities = priorities;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<PriorityDto> getPriorities() {
        return priorities;
    }

    public void setPriorities(List<PriorityDto> priorities) {
        this.priorities = priorities;
    }
}
