package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyResultDto {

    private int year;

    private String month;

    private String week;

    private List<WeeklyPlanningDto> weeklyPlanningDtos;

    private List<List<ActivityDto>> activities;

    public WeeklyResultDto() {
    }

    public WeeklyResultDto(int year, String month, String week, List<WeeklyPlanningDto> weeklyPlanningDtos, List<List<ActivityDto>> activities) {
        this.year = year;
        this.month = month;
        this.week = week;
        this.weeklyPlanningDtos = weeklyPlanningDtos;
        this.activities = activities;
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

    public List<WeeklyPlanningDto> getWeeklyPlanningDtos() {
        return weeklyPlanningDtos;
    }

    public void setWeeklyPlanningDtos(List<WeeklyPlanningDto> weeklyPlanningDtos) {
        this.weeklyPlanningDtos = weeklyPlanningDtos;
    }

    public List<List<ActivityDto>> getActivities() {
        return activities;
    }

    public void setActivities(List<List<ActivityDto>> activities) {
        this.activities = activities;
    }
}
