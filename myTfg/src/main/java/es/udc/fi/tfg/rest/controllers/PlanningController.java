package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.entities.Priority;
import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.model.services.PrioritiesService;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.rest.common.ErrorsDto;
import es.udc.fi.tfg.rest.dtos.*;

import java.io.IOException;
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

    @Autowired
    private PrioritiesService prioritiesService;

    @ExceptionHandler(NoSolutionException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorsDto handleNoSolutionException(NoSolutionException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(NO_SOLUTION_EXCEPTION_CODE, null,
                NO_SOLUTION_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorsDto handleUnexpectedException(Exception exception) {
        return new ErrorsDto("Se ha producido un error inesperado: " + exception.getMessage());
    }

    @PostMapping("/annual")
    public List<AnnualPlanningDto> annualPlanning(@Validated @RequestBody List<AnnualPlanningDataDto> params, @RequestParam int year)
            throws NoSolutionException, IOException, ClassNotFoundException {

        List<Priority> costs = prioritiesService.getPriorities().get("Anual");

        Map<String, Map<Integer, String>> planning =
                planningService.getAnnualPlanning(AnnualPlanningDataConversor.toClingoParams(params, costs), year);

        return AnnualPlanningConversor.toAnnualPlanningDtos(planning, params);
    }

    @PostMapping("/monthly")
    public MonthlyResultDto monthlyPlanning(@Validated @RequestBody MonthlyDataDto params)
            throws NoSolutionException, IOException, ClassNotFoundException {

        List<Priority> costs = prioritiesService.getPriorities().get("Mensual");

        Map<String, Map<Integer, String>> previousMonthPlanning = planningService.getMonthFromJson(params.getMonth(), params.getYear(), true);

        Map<String, Map<Integer, String>> planning =
                planningService.getMonthlyPlanning(MonthlyDataConversor.toClingoParams(
                        params, costs, previousMonthPlanning), params.getMonth(), params.getYear());

        return MonthlyPlanningConversor.toMonthlyPlanningDtos(planning, params.getMonth(), params.getNumberOfDays());
    }

    @GetMapping("/monthly")
    public MonthlyResultDto getMonthlyPlanning(@RequestParam String month, @RequestParam int year,
                                               @RequestParam Integer numDays)
            throws NoSolutionException, IOException, ClassNotFoundException {

        Map<String, Map<Integer, String>> monthPlanning = planningService.getMonthFromJson(month, year, false);

        return MonthlyPlanningConversor.toMonthlyPlanningDtos(monthPlanning, month, numDays);
    }

    @PostMapping("/weekly")
    public WeeklyResultDto weeklyPlanning(@Validated @RequestBody WeeklyDataDto params)
            throws IOException, ClassNotFoundException, NoSolutionException {

        List<Priority> costs = prioritiesService.getPriorities().get("Semanal");

        Map<String, Map<Integer, String>> planning =
                planningService.getWeeklyPlanning(WeeklyDataConversor.toClingoParams(params, costs));

        return WeeklyPlanningConversor.toWeeklyPlanningDtos(planning, params.getMonth());
    }
}
