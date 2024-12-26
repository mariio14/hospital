package es.udc.fi.tfg.rest.dtos;

import java.util.Map;

public class AnnualPlanningDto {

    private String name;

    private Map<Integer, String> assignations;
    
    public AnnualPlanningDto() {
    }

    public AnnualPlanningDto(String name, Map<Integer, String> assignations) {
        this.name = name;
        this.assignations = assignations;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<Integer, String> getAssignations() {
        return this.assignations;
    }

    public void setAssignations(Map<Integer, String> assignations) {
        this.assignations = assignations;
    }
}