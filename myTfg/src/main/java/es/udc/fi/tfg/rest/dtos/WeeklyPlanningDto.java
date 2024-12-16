package es.udc.fi.tfg.rest.dtos;

import java.util.Map;

public class WeeklyPlanningDto {

    private String name;

    private Map<String, String> assignations;

    public WeeklyPlanningDto() {
    }

    public WeeklyPlanningDto(String name, Map<String, String> assignations) {
        this.name = name;
        this.assignations = assignations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, String> getAssignations() {
        return assignations;
    }

    public void setAssignations(Map<String, String> assignations) {
        this.assignations = assignations;
    }
}
