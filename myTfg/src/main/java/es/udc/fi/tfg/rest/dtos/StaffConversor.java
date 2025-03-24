package es.udc.fi.tfg.rest.dtos;

import es.udc.fi.tfg.model.entities.Staff;

import java.util.List;
import java.util.stream.Collectors;

public class StaffConversor {

    private StaffConversor() {
    }

    public static List<StaffDto> toStaffDtos(List<Staff> staff) {
        return staff.stream().map(StaffConversor::toStaffDto).collect(Collectors.toList());
    }

    public static StaffDto toStaffDto(Staff staff) {
        return new StaffDto(staff.getId(), staff.getName(), staff.getLevel());
    }
}
