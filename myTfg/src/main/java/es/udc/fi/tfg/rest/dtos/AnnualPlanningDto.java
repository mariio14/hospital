package es.udc.fi.tfg.rest.dtos;

import java.util.List;
import java.util.Map;

public class AnnualPlanningDto {

    private String name;

    private String level;

    private List<String> assignations;
    
    public AnnualPlanningDto() {
    }

    public AnnualPlanningDto(String name, String level, List<String> assignations) {
        this.name = name;
        this.level = level;
        this.assignations = assignations;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public List<String> getAssignations() {
        return this.assignations;
    }

    public void setAssignations(List<String> assignations) {
        this.assignations = assignations;
    }
}