package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyResultDto {

    private int year;

    private String month;

    private String week;

    private List<WeeklyPlanningDto> weeklyPlanningDtos;

    public WeeklyResultDto() {
    }

    public WeeklyResultDto(int year, String month, String week, List<WeeklyPlanningDto> weeklyPlanningDtos) {
        this.year = year;
        this.month = month;
        this.week = week;
        this.weeklyPlanningDtos = weeklyPlanningDtos;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public List<WeeklyPlanningDto> getAssignations() {
        return weeklyPlanningDtos;
    }

    public void setAssignations(List<WeeklyPlanningDto> assignations) {
        this.weeklyPlanningDtos = assignations;
    }
}
