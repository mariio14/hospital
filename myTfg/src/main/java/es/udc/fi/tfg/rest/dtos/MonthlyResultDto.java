package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class MonthlyResultDto {

    private String month;

    private List<MonthlyPlanningDto> monthlyPlanningDtos;

    private Boolean complete;

    public MonthlyResultDto() {
    }

    public MonthlyResultDto(String month, List<MonthlyPlanningDto> monthlyPlanningDtos, Boolean complete) {
        this.month = month;
        this.monthlyPlanningDtos = monthlyPlanningDtos;
        this.complete = complete;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public List<MonthlyPlanningDto> getMonthlyPlanningDtos() {
        return monthlyPlanningDtos;
    }

    public void setMonthlyPlanningDtos(List<MonthlyPlanningDto> monthlyPlanningDtos) {
        this.monthlyPlanningDtos = monthlyPlanningDtos;
    }

    public Boolean getComplete() {
        return complete;
    }

    public void setComplete(Boolean complete) {
        this.complete = complete;
    }
}
