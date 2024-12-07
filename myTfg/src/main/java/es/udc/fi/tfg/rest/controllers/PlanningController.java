package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.model.util.PlanningType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    @Autowired
    private PlanningService planningService;

    @PostMapping("/annual")
    public void annualPlanning() {
        planningService.getPlanning(PlanningType.ANNUAL);
    }
}
