package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.rest.common.ErrorsDto;
import es.udc.fi.tfg.rest.dtos.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

    private static final String NO_SOLUTION_EXCEPTION_CODE = "project.exceptions.NoSolutionException";

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private PlanningService planningService;

    @ExceptionHandler(NoSolutionException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorsDto handleNoSolutionException(NoSolutionException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(NO_SOLUTION_EXCEPTION_CODE, null,
                NO_SOLUTION_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);
    }

    @PostMapping("/annual")
    public List<AnnualPlanningDto> annualPlanning(@Validated @RequestBody List<AnnualPlanningDataDto> params)
            throws NoSolutionException {

        Map<String, Map<Integer, String>> planning =
                planningService.getAnnualPlanning(AnnualPlanningDataConversor.toClingoParams(params));

        return AnnualPlanningConversor.toAnnualPlanningDtos(planning, params);
    }

    @PostMapping("/monthly")
    public List<MonthlyPlanningDto> monthlyPlanning() throws NoSolutionException {
        return MonthlyPlanningConversor.toMonthlyPlanningDtos(planningService.getAnnualPlanning(""));
    }

    @PostMapping("/weekly")
    public List<WeeklyPlanningDto> weeklyPlanning() {
        return WeeklyPlanningConversor.toWeeklyPlanningDtos(planningService.getWeeklyPlanning());
    }
}
