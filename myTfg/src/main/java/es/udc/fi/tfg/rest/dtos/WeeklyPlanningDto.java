package es.udc.fi.tfg.rest.dtos;

import java.util.Map;

public class WeeklyPlanningDto {

    private String name;

    private Map<Integer, String> assignations;

    public WeeklyPlanningDto() {
    }

    public WeeklyPlanningDto(String name, Map<Integer, String> assignations) {
        this.name = name;
        this.assignations = assignations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<Integer, String> getAssignations() {
        return assignations;
    }

    public void setAssignations(Map<Integer, String> assignations) {
        this.assignations = assignations;
    }
}
