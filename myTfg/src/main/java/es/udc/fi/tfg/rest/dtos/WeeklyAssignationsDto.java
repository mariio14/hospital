package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyAssignationsDto {

    private String name;

    private String level;

    private List<List<String>> assignations;

    private List<List<String>> eveningAssignations;

    public WeeklyAssignationsDto() {
    }

    public WeeklyAssignationsDto(String name, String level, List<List<String>> assignations, List<List<String>> eveningAssignations) {
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

    public List<List<String>> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<List<String>> assignations) {
        this.assignations = assignations;
    }

    public List<List<String>> getEveningAssignations() {
        return eveningAssignations;
    }

    public void setEveningAssignations(List<List<String>> eveningAssignations) {
        this.eveningAssignations = eveningAssignations;
    }
}
