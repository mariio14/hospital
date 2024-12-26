package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.rest.dtos.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    @Autowired
    private PlanningService planningService;

    @PostMapping("/annual")
    public List<AnnualPlanningDto> annualPlanning(@Validated @RequestBody List<AnnualPlanningDataDto> params) {
        return AnnualPlanningConversor.toAnnualPlanningDtos(planningService.getAnnualPlanning(
                AnnualPlanningDataConversor.toClingoParams(params)));
    }

    @PostMapping("/monthly")
    public List<AnnualPlanningDto> monthlyPlanning() {
        return AnnualPlanningConversor.toAnnualPlanningDtos(planningService.getAnnualPlanning(""));
    }

    @PostMapping("/weekly")
    public List<WeeklyPlanningDto> weeklyPlanning() {
        return WeeklyPlanningConversor.toWeeklyPlanningDtos(planningService.getWeeklyPlanning());
    }
}
