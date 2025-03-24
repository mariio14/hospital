package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.services.StaffService;
import es.udc.fi.tfg.rest.dtos.StaffConversor;
import es.udc.fi.tfg.rest.dtos.StaffDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping("")
    public List<StaffDto> getStaff() throws IOException, ClassNotFoundException {
        return StaffConversor.toStaffDtos(staffService.getStaff());
    }

    @PutMapping("/modify")
    public void modifyStaff(@Validated @RequestBody List<StaffDto> staff) throws IOException, ClassNotFoundException {
        staffService.modifyStaff(staff);
    }
}
