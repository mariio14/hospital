package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class MonthlyDataDto {

    private String month;

    private int numberOfDays;

    private List<MonthlyAssignationsDto> monthlyAssignationsDtos;

    public MonthlyDataDto() {
    }

    public MonthlyDataDto(String month, int numberOfDays, List<MonthlyAssignationsDto> monthlyAssignationsDtos) {
        this.month = month;
        this.numberOfDays = numberOfDays;
        this.monthlyAssignationsDtos = monthlyAssignationsDtos;
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

    public List<MonthlyAssignationsDto> getMonthlyAssignationsDtos() {
        return monthlyAssignationsDtos;
    }

    public void setMonthlyAssignationsDtos(List<MonthlyAssignationsDto> monthlyAssignationsDtos) {
        this.monthlyAssignationsDtos = monthlyAssignationsDtos;
    }
}
