package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyAssignationsDto {

    private String name;

    private String level;

    private List<String> assignations;

    public WeeklyAssignationsDto() {
    }

    public WeeklyAssignationsDto(String name, String level, List<String> assignations) {
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

    public List<String> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<String> assignations) {
        this.assignations = assignations;
    }
}
