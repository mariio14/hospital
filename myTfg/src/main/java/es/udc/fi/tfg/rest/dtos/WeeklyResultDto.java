package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyResultDto {

    private String month;

    private List<WeeklyPlanningDto> assignations;

    public WeeklyResultDto() {
    }

    public WeeklyResultDto(String month, List<WeeklyPlanningDto> assignations) {
        this.month = month;
        this.assignations = assignations;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public List<WeeklyPlanningDto> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<WeeklyPlanningDto> assignations) {
        this.assignations = assignations;
    }
}
