package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class GetWeeklyDataDto {

    private List<Integer> days;

    public GetWeeklyDataDto() {
    }

    public GetWeeklyDataDto(List<Integer> days) {
        this.days = days;
    }

    public List<Integer> getDays() {
        return days;
    }

    public void setDays(List<Integer> days) {
        this.days = days;
    }
}
