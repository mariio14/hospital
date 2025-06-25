package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyDataDto {

    private int year;

    private String month;

    private String week;

    private List<WeeklyAssignationsDto> assignationsDtos;

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

    public List<WeeklyAssignationsDto> getAssignationsDtos() {
        return assignationsDtos;
    }

    public void setAssignationsDtos(List<WeeklyAssignationsDto> assignationsDtos) {
        this.assignationsDtos = assignationsDtos;
    }
}
