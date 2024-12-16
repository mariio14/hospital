package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.rest.dtos.AnnualPlanningConversor;
import es.udc.fi.tfg.rest.dtos.AnnualPlanningDto;

import java.util.List;

import es.udc.fi.tfg.rest.dtos.WeeklyPlanningConversor;
import es.udc.fi.tfg.rest.dtos.WeeklyPlanningDto;
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
    public List<AnnualPlanningDto> annualPlanning() {
        return AnnualPlanningConversor.toAnnualPlanningDtos(planningService.getAnnualPlanning());
    }

    @PostMapping("/monthly")
    public List<AnnualPlanningDto> monthlyPlanning() {
        return AnnualPlanningConversor.toAnnualPlanningDtos(planningService.getAnnualPlanning());
    }

    @PostMapping("/weekly")
    public List<WeeklyPlanningDto> weeklyPlanning() {
        return WeeklyPlanningConversor.toWeeklyPlanningDtos(planningService.getWeeklyPlanning());
    }
}
