package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.entities.Priority;
import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.model.services.PrioritiesService;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.rest.common.ErrorsDto;
import es.udc.fi.tfg.rest.dtos.*;

import java.io.IOException;
import java.time.Month;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.time.YearMonth;

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

    private static final Map<String, Month> MONTH_TRANSLATION = Map.ofEntries(
            Map.entry("ENERO", Month.JANUARY),
            Map.entry("FEBRERO", Month.FEBRUARY),
            Map.entry("MARZO", Month.MARCH),
            Map.entry("ABRIL", Month.APRIL),
            Map.entry("MAYO", Month.MAY),
            Map.entry("JUNIO", Month.JUNE),
            Map.entry("JULIO", Month.JULY),
            Map.entry("AGOSTO", Month.AUGUST),
            Map.entry("SEPTIEMBRE", Month.SEPTEMBER),
            Map.entry("OCTUBRE", Month.OCTOBER),
            Map.entry("NOVIEMBRE", Month.NOVEMBER),
            Map.entry("DICIEMBRE", Month.DECEMBER)
    );

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

    @PostMapping("/savedYearly")
    public List<AnnualPlanningDto> getAnnualPlanning(@RequestParam int year, @Validated @RequestBody List<AnnualPlanningDataDto> params)
            throws NoSolutionException, IOException, ClassNotFoundException {

        Map<String, Map<Integer, String>> annualPlanning = planningService.getYearFromJson(year);

        return AnnualPlanningConversor.toAnnualPlanningDtos(annualPlanning, params);
    }

    @PostMapping("/monthly")
    public MonthlyResultDto monthlyPlanning(@Validated @RequestBody MonthlyDataDto params)
            throws NoSolutionException, IOException, ClassNotFoundException {

        List<Priority> costs = prioritiesService.getPriorities().get("Mensual");

        Map<String, Map<Integer, String>> previousMonthPlanning = planningService.getMonthFromJson(params.getMonth(), params.getYear(), true);

        Map<String, Map<Integer, String>> planning =
                planningService.getMonthlyPlanning(MonthlyDataConversor.toClingoParams(
                        params, costs, previousMonthPlanning), params.getMonth(), params.getYear());

        return MonthlyPlanningConversor.toMonthlyPlanningDtosFromData(planning, params);
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

        Month monthEnum = MONTH_TRANSLATION.get(params.getMonth().toUpperCase());
        int daysInMonth = YearMonth.of(params.getYear(), monthEnum).lengthOfMonth();
        MonthlyResultDto monthData = getMonthlyPlanning(params.getMonth(), params.getYear(), daysInMonth);

        Map<String, Map<Integer, String>> annualData = planningService.getYearFromJson(params.getYear());

        Map<String, Map<Integer, String>> planning =
                planningService.getWeeklyPlanning(WeeklyDataConversor.toClingoParams(params, costs, annualData, monthData),
                        params.getYear(), params.getMonth(), params.getWeek());
        System.out.println("11");

        return WeeklyPlanningConversor.toWeeklyPlanningDtosFromData(planning, params);
    }

    @GetMapping("/weekly")
    public WeeklyResultDto getWeeklyPlanning(@RequestParam String month, @RequestParam int year,
                                             @RequestParam String week)
            throws NoSolutionException, IOException, ClassNotFoundException {

        Map<String, Map<Integer, String>> monthPlanning = planningService.getWeekFromJson(year, month, week);

        return WeeklyPlanningConversor.toWeeklyPlanningDtos(monthPlanning, year, month, week);
    }
}
