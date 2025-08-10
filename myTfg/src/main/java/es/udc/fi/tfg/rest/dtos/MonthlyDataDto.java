package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class MonthlyDataDto {

    private String month;

    private int year;

    private int numberOfDays;

    private int numberOfDaysPrevMonth;

    private String firstDay;

    private int firstFriday;

    private List<Integer> weekends;  // quitar?

    private List<Integer> festivos;

    private List<MonthlyAssignationsDto> monthlyPlanningDtos;

    public MonthlyDataDto() {
    }

    public MonthlyDataDto(String month, int year, int numberOfDays, int numberOfDaysPrevMonth, String firstDay, int firstFriday, List<Integer> weekends, List<Integer> festivos, List<MonthlyAssignationsDto> monthlyPlanningDtos) {
        this.month = month;
        this.year = year;
        this.numberOfDays = numberOfDays;
        this.numberOfDaysPrevMonth = numberOfDaysPrevMonth;
        this.firstDay = firstDay;
        this.firstFriday = firstFriday;
        this.weekends = weekends;
        this.festivos = festivos;
        this.monthlyPlanningDtos = monthlyPlanningDtos;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(int numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

    public List<MonthlyAssignationsDto> getMonthlyPlanningDtos() {
        return monthlyPlanningDtos;
    }

    public void setMonthlyPlanningDtos(List<MonthlyAssignationsDto> monthlyPlanningDtos) {
        this.monthlyPlanningDtos = monthlyPlanningDtos;
    }

    public int getNumberOfDaysPrevMonth() {
        return numberOfDaysPrevMonth;
    }

    public void setNumberOfDaysPrevMonth(int numberOfDaysPrevMonth) {
        this.numberOfDaysPrevMonth = numberOfDaysPrevMonth;
    }

    public List<Integer> getWeekends() {
        return weekends;
    }

    public void setWeekends(List<Integer> weekends) {
        this.weekends = weekends;
    }

    public List<Integer> getFestivos() {
        return festivos;
    }

    public void setFestivos(List<Integer> festivos) {
        this.festivos = festivos;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getFirstDay() {
        return firstDay;
    }

    public void setFirstDay(String firstDay) {
        this.firstDay = firstDay;
    }

    public int getFirstFriday() {
        return firstFriday;
    }

    public void setFirstFriday(int firstFriday) {
        this.firstFriday = firstFriday;
    }
}
