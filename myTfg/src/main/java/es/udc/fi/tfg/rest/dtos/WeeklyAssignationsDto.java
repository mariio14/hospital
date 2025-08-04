package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyAssignationsDto {

    private String name;

    private String level;

    private List<String> assignations;

    private List<String> eveningAssignations;

    public WeeklyAssignationsDto() {
    }

    public WeeklyAssignationsDto(String name, String level, List<String> assignations, List<String> eveningAssignations) {
        this.name = name;
        this.level = level;
        this.assignations = assignations;
        this.eveningAssignations = eveningAssignations;
    }

    public String getName() {
        return name;
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
