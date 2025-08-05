package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyPlanningDto {

    private String name;

    private String color;

    private List<String> assignations;

    private List<String> eveningAssignations;

    public WeeklyPlanningDto() {
    }

    public WeeklyPlanningDto(String name, String color, List<String> assignations, List<String> eveningAssignations) {
        this.name = name;
        this.color = color;
        this.assignations = assignations;
        this.eveningAssignations = eveningAssignations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
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
