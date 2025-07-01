package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyDataDto {

    private int year;

    private String month;

    private String week;

    private List<Integer> days;

    private List<WeeklyAssignationsDto> weeklyAssignationsDtos;

    public WeeklyDataDto() {
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

    public List<Integer> getDays() {
        return days;
    }

    public void setDays(List<Integer> days) {
        this.days = days;
    }

    public List<WeeklyAssignationsDto> getWeeklyAssignationsDtos() {
        return weeklyAssignationsDtos;
    }

    public void setWeeklyAssignationsDtos(List<WeeklyAssignationsDto> weeklyAssignationsDtos) {
        this.weeklyAssignationsDtos = weeklyAssignationsDtos;
    }
}
