package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class WeeklyDataDto {

    private String month;

    private List<WeeklyAssignationsDto> assignationsDtos;

    public WeeklyDataDto() {
    }

    public WeeklyDataDto(String month, List<WeeklyAssignationsDto> assignationsDtos) {
        this.month = month;
        this.assignationsDtos = assignationsDtos;
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
