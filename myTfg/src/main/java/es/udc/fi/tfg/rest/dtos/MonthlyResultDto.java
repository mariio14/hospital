package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class MonthlyResultDto {

    private String month;

    private List<MonthlyPlanningDto> monthlyPlanningDtos;

    public MonthlyResultDto() {
    }

    public MonthlyResultDto(String month, List<MonthlyPlanningDto> monthlyPlanningDtos) {
        this.month = month;
        this.monthlyPlanningDtos = monthlyPlanningDtos;
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
}
