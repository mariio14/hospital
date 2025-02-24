package es.udc.fi.tfg.rest.dtos;

import java.util.Map;

public class WeeklyAssignationsDto {

    private String name;

    private String level;

    private Map<Integer, String> assignations;

    public WeeklyAssignationsDto() {
    }

    public WeeklyAssignationsDto(String name, String level, Map<Integer, String> assignations) {
        this.name = name;
        this.level = level;
        this.assignations = assignations;
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

    public Map<Integer, String> getAssignations() {
        return assignations;
    }

    public void setAssignations(Map<Integer, String> assignations) {
        this.assignations = assignations;
    }
}
