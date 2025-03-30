package es.udc.fi.tfg.rest.dtos;

import java.util.List;
import java.util.Map;

public class MonthlyPlanningDto {

    private String name;

    private List<String> assignations;

    public MonthlyPlanningDto() {
    }

    public MonthlyPlanningDto(String name, List<String> assignations) {
        this.assignations = assignations;
        this.name = name;
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
