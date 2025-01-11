package es.udc.fi.tfg.rest.dtos;

import java.util.Map;

public class MonthlyPlanningDto {

    private String name;

    private Map<Integer, String> assignations;

    public MonthlyPlanningDto() {
    }

    public MonthlyPlanningDto(String name, Map<Integer, String> assignations) {
        this.assignations = assignations;
        this.name = name;
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
