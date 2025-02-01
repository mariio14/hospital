package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.services.PrioritiesService;
import es.udc.fi.tfg.rest.dtos.*;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/priorities")
public class PrioritiesController {

    @Autowired
    private PrioritiesService prioritiesService;

    @GetMapping("")
    public List<PriorityGroupDto> getPriorities() throws IOException, ClassNotFoundException {
        return PriorityConversor.toPriorityGroupDtos(prioritiesService.getPriorities());
    }

    @PutMapping("/modify")
    public void modifyPriority(@Validated @RequestBody PriorityData data) throws IOException, ClassNotFoundException {
        prioritiesService.modifyPriority(data.getId(), data.getCost());
    }
}
