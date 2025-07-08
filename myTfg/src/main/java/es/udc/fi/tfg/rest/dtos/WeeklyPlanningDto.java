package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyPlanningDto {

    private String name;

    private List<String> assignations;

    public WeeklyPlanningDto() {
    }

    public WeeklyPlanningDto(String name, List<String> assignations) {
        this.name = name;
        this.assignations = assignations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<String> assignations) {
        this.assignations = assignations;
    }
}
