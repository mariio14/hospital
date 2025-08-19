package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyPlanningDto {

    private String name;

    private List<String> colors;

    private List<String> assignations;

    private List<String> eveningAssignations;

    public WeeklyPlanningDto() {
    }

    public WeeklyPlanningDto(String name, List<String> colors, List<String> assignations, List<String> eveningAssignations) {
        this.name = name;
        this.colors = colors;
        this.assignations = assignations;
        this.eveningAssignations = eveningAssignations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public List<String> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<String> assignations) {
        this.assignations = assignations;
    }

    public List<String> getEveningAssignations() {
        return eveningAssignations;
    }

    public void setEveningAssignations(List<String> eveningAssignations) {
        this.eveningAssignations = eveningAssignations;
    }
}
