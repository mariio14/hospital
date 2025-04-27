package es.udc.fi.tfg.rest.dtos;

import java.util.ArrayList;
import java.util.List;

public class MonthlyPlanningDto {

    private String name;

    private List<String> assignations;

    private List<List<String>> notValidAssignations;

    public MonthlyPlanningDto() {
    }

    public MonthlyPlanningDto(String name, List<String> assignations, int days) {
        this.assignations = assignations;
        this.name = name;
        this.notValidAssignations = new ArrayList<>();

        for (int i = 0; i < days; i++) {
            this.notValidAssignations.add(new ArrayList<>());
        }
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

    public List<List<String>> getNotValidAssignations() {
        return notValidAssignations;
    }

    public void setNotValidAssignations(List<List<String>> notValidAssignations) {
        this.notValidAssignations = notValidAssignations;
    }
}
