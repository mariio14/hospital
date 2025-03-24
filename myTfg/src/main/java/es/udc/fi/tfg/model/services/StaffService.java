package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.rest.dtos.StaffDto;

import java.io.IOException;
import java.util.List;

public interface StaffService {

    List<Staff> getStaff() throws IOException, ClassNotFoundException;

    void modifyStaff(List<StaffDto> staffList) throws IOException, ClassNotFoundException;

}
