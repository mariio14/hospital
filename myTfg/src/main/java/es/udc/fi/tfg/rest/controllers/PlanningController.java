package es.udc.fi.tfg.rest.controllers;

import es.udc.fi.tfg.model.entities.ActivityAndPlanning;
import es.udc.fi.tfg.model.entities.Priority;
import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.model.services.PlanningService;
import es.udc.fi.tfg.model.services.PrioritiesService;
import es.udc.fi.tfg.model.services.StaffService;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.model.services.exceptions.PlanningNotGeneratedException;
import es.udc.fi.tfg.rest.common.ErrorsDto;
import es.udc.fi.tfg.rest.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Month;
import java.time.YearMonth;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/plannings")
public class PlanningController {

	@Autowired
	private MessageSource messageSource;

	@Autowired
	private PlanningService planningService;

	@Autowired
	private StaffService staffService;

	@Autowired
	private PrioritiesService prioritiesService;

	private static final Map<String, Month> MONTH_TRANSLATION = Map.ofEntries(Map.entry("ENERO", Month.JANUARY),
			Map.entry("FEBRERO", Month.FEBRUARY), Map.entry("MARZO", Month.MARCH), Map.entry("ABRIL", Month.APRIL),
			Map.entry("MAYO", Month.MAY), Map.entry("JUNIO", Month.JUNE), Map.entry("JULIO", Month.JULY),
			Map.entry("AGOSTO", Month.AUGUST), Map.entry("SEPTIEMBRE", Month.SEPTEMBER),
			Map.entry("OCTUBRE", Month.OCTOBER), Map.entry("NOVIEMBRE", Month.NOVEMBER),
			Map.entry("DICIEMBRE", Month.DECEMBER));

	private static final Map<String, String> NEXT_MONTH = Map.ofEntries(Map.entry("ENERO", "FEBRERO"),
			Map.entry("FEBRERO", "MARZO"), Map.entry("MARZO", "ABRIL"), Map.entry("ABRIL", "MAYO"),
			Map.entry("MAYO", "JUNIO"), Map.entry("JUNIO", "JULIO"), Map.entry("JULIO", "AGOSTO"),
			Map.entry("AGOSTO", "SEPTIEMBRE"), Map.entry("SEPTIEMBRE", "OCTUBRE"), Map.entry("OCTUBRE", "NOVIEMBRE"),
			Map.entry("NOVIEMBRE", "DICIEMBRE"), Map.entry("DICIEMBRE", "ENERO"));

	private static final Map<String, String> PREVIOUS_MONTH = Map.ofEntries(
			Map.entry("ENERO", "DICIEMBRE"),
			Map.entry("FEBRERO", "ENERO"),
			Map.entry("MARZO", "FEBRERO"),
			Map.entry("ABRIL", "MARZO"),
			Map.entry("MAYO", "ABRIL"),
			Map.entry("JUNIO", "MAYO"),
			Map.entry("JULIO", "JUNIO"),
			Map.entry("AGOSTO", "JULIO"),
			Map.entry("SEPTIEMBRE", "AGOSTO"),
			Map.entry("OCTUBRE", "SEPTIEMBRE"),
			Map.entry("NOVIEMBRE", "OCTUBRE"),
			Map.entry("DICIEMBRE", "NOVIEMBRE")
	);

	@ExceptionHandler(NoSolutionException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public ErrorsDto handleNoSolutionException(NoSolutionException exception, Locale locale) {

		final String errorMessage = this.messageSource.getMessage(exception.getMessage(), null, exception.getMessage(),
				locale);

		return new ErrorsDto(errorMessage);
	}

	@ExceptionHandler(PlanningNotGeneratedException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	public ErrorsDto handlePlanningNotGeneratedException(PlanningNotGeneratedException exception, Locale locale) {

		final String errorMessage = this.messageSource.getMessage(exception.getMessage(), null, exception.getMessage(),
				locale);

		return new ErrorsDto(errorMessage);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public ErrorsDto handleUnexpectedException(Exception exception) {
		return new ErrorsDto("Se ha producido un error inesperado: " + exception.getMessage());
	}

	@PostMapping("/annual")
	public List<AnnualResultDto> annualPlanning(@Validated @RequestBody AnnualDataDto params, @RequestParam int year)
			throws NoSolutionException, IOException, ClassNotFoundException {

		final List<Priority> costs = this.prioritiesService.getPriorities().get("Anual");

		final List<Map<String, Map<Integer, String>>> planning = this.planningService
				.getAnnualPlanning(AnnualPlanningDataConversor.toClingoParams(params, costs), year);

		final List<Staff> staffList = this.staffService.getStaff();
		return AnnualPlanningConversor.toAnnualPlanningDtos(planning, staffList);
	}

	@PostMapping("/savedYearly")
	public List<AnnualResultDto> getAnnualPlanning(@RequestParam int year, @Validated @RequestBody AnnualDataDto params)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		final List<Map<String, Map<Integer, String>>> annualPlanning = this.planningService.getYearFromJson(year,
				false);

		final List<Staff> staffList = this.staffService.getStaff();
		return AnnualPlanningConversor.toAnnualPlanningDtos(annualPlanning, staffList);
	}

	@PostMapping("/monthly")
	public List<MonthlyResultDto> monthlyPlanning(@Validated @RequestBody MonthlyDataDto params)
			throws NoSolutionException, IOException, ClassNotFoundException, PlanningNotGeneratedException {

		final List<Priority> costs = this.prioritiesService.getPriorities().get("Mensual");

		final Map<String, Map<Integer, String>> previousMonthPlanning = this.planningService
				.getMonthFromJson(params.getMonth(), params.getYear(), true, false).get(0);

		final List<Map<String, Map<Integer, String>>> planning = this.planningService.getMonthlyPlanning(
				MonthlyDataConversor.toClingoParams(params, costs, previousMonthPlanning), params.getMonth(),
				params.getYear());

		final List<Staff> staffList = this.staffService.getStaff();
		return MonthlyPlanningConversor.toMonthlyPlanningDtosFromData(planning, params.getMonth(),
				params.getNumberOfDays(), staffList);
	}

	@GetMapping("/monthly")
	public List<MonthlyResultDto> getMonthlyPlanning(@RequestParam String month, @RequestParam int year,
			@RequestParam Integer numDays) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		return this.getMonthlyPlanning(month, year, numDays, false);
	}

	private List<MonthlyResultDto> getMonthlyPlanning(String month, int year, Integer numDays, boolean throwsException)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		final List<Map<String, Map<Integer, String>>> monthPlanning = this.planningService.getMonthFromJson(month, year,
				false, throwsException);

		final List<Staff> staffList = this.staffService.getStaff();
		return MonthlyPlanningConversor.toMonthlyPlanningDtos(monthPlanning, month, numDays, staffList);
	}

	@PostMapping("/weekly")
	public List<WeeklyResultDto> weeklyPlanning(@Validated @RequestBody WeeklyDataDto params)
			throws IOException, ClassNotFoundException, NoSolutionException, PlanningNotGeneratedException {

		final List<Priority> costs = this.prioritiesService.getPriorities().get("Semanal");

		final boolean yearChanged = this.isYearChanged(params.getMonth(), params.getDays());
		final Map<String, Map<Integer, String>> annualData = this.planningService
				.getYearFromJson(params.getYear(), true).get(0);
		final Map<String, Map<Integer, String>> prevAnnualData = yearChanged
				? this.planningService.getYearFromJson(params.getYear() - 1, true).get(0)
				: null;

		final Month monthEnum = MONTH_TRANSLATION.get(params.getMonth().toUpperCase());
		final int daysInMonth = YearMonth.of(params.getYear(), monthEnum).lengthOfMonth();
		final MonthlyResultDto monthData = this
				.getMonthlyPlanning(params.getMonth(), params.getYear(), daysInMonth, true).get(0);

		boolean cambio = params.getDays().contains(1) && (params.getDays().contains(28) || params.getDays().contains(29)
				|| params.getDays().contains(30) || params.getDays().contains(31));
		if (cambio) {
			final Month monthEnum2 = MONTH_TRANSLATION.get(PREVIOUS_MONTH.get(params.getMonth().toUpperCase()));
			final int daysInMonth2 = monthEnum2.equals(Month.DECEMBER)
					? YearMonth.of(params.getYear() - 1, monthEnum2).lengthOfMonth()
					: YearMonth.of(params.getYear(), monthEnum2).lengthOfMonth();
			final String previousMonth = PREVIOUS_MONTH.get(params.getMonth().toUpperCase());
			final String capitalized = previousMonth.substring(0, 1).toUpperCase() + previousMonth.substring(1).toLowerCase();
			final MonthlyResultDto monthDataPrev = this
					.getMonthlyPlanning(capitalized, params.getYear(), daysInMonth2, true).get(0);
			for (final MonthlyPlanningDto monthlyPlanningDto : monthData.getMonthlyPlanningDtos()) {
				final String worker = monthlyPlanningDto.getName();
				for (final MonthlyPlanningDto dtoNextMonth : monthDataPrev.getMonthlyPlanningDtos()) {
					if (dtoNextMonth.getName().equals(worker)) {
						for (int i = 0; i < 8; i++) {
							monthlyPlanningDto.getAssignations().set(daysInMonth-1-i, dtoNextMonth.getAssignations().get(daysInMonth-1-i));
						}
					}
				}
			}
		}
		final List<Map<String, Map<Integer, List<String>>>> planning = this.planningService.getWeeklyPlanning(
				WeeklyDataConversor.toClingoParams(params, costs, annualData, prevAnnualData, monthData,
						params.getYear(), params.getMonth()),
				params.getYear(), params.getMonth(), params.getWeek(), params.getActivities());

		final List<Staff> staffList = this.staffService.getStaff();
		return WeeklyPlanningConversor.toWeeklyPlanningDtosFromData(planning, params, annualData, prevAnnualData,
				yearChanged, staffList, monthData);
	}

	@PostMapping("/getWeekly")
	public List<WeeklyResultDto> getWeeklyPlanning(@RequestParam String month, @RequestParam int year,
			@RequestParam String week, @Validated @RequestBody GetWeeklyDataDto params)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		final boolean yearChanged = this.isYearChanged(month, params.getDays());
		final ActivityAndPlanning weekPlanning = this.planningService.getWeekFromJson(year, month, week, yearChanged);

		final List<Staff> staffList = this.staffService.getStaff();

		return WeeklyPlanningConversor.toWeeklyPlanningDtos(weekPlanning, year, month, week, staffList, params,
				yearChanged);
	}

	@PostMapping("/saveWeekly")
	public void saveWeeklyPlanning(@Validated @RequestBody WeeklyDataDto params)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		this.planningService.saveWeekInJson(params.getYear(), params.getMonth(), params.getWeek(),
				params.getWeeklyPlanningDtos(), params.getActivities(), params.getDays());
	}

	@PostMapping("/saveMonthly")
	public void saveMonthlyPlanning(@Validated @RequestBody MonthlyDataDto params)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		this.planningService.saveMonthInJson(params.getYear(), params.getMonth(), params.getMonthlyPlanningDtos());
	}

	@PostMapping("/saveYearly")
	public void saveYearlyPlanning(@Validated @RequestBody AnnualDataDto params, @RequestParam int year)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		this.planningService.saveYearInJson(year, params);
	}

	@PostMapping("/checkAnnual")
	public void checkAnnualPlanning(@Validated @RequestBody AnnualDataDto params, @RequestParam int year)
			throws NoSolutionException, IOException, ClassNotFoundException, PlanningNotGeneratedException {
		try {
			final List<Priority> costs = this.prioritiesService.getPriorities().get("Anual");
			this.planningService.checkAnnualPlanning(AnnualPlanningDataConversor.toClingoParams(params, costs), year,
					AnnualPlanningDataConversor.toMap(params));
		} catch (final NoSolutionException e) {
			this.planningService.saveYearInJson(year, params);
			throw new NoSolutionException("Cambio no válido");
		}
	}

	@PostMapping("/checkMonthly")
	public void checkMonthlyPlanning(@Validated @RequestBody MonthlyDataDto params)
			throws NoSolutionException, IOException, ClassNotFoundException, PlanningNotGeneratedException {
		try {
			final List<Priority> costs = this.prioritiesService.getPriorities().get("Mensual");

			final Map<String, Map<Integer, String>> previousMonthPlanning = this.planningService
					.getMonthFromJson(params.getMonth(), params.getYear(), true, false).get(0);

			this.planningService.checkMonthlyPlanning(
					MonthlyDataConversor.toClingoParams(params, costs, previousMonthPlanning), params.getMonth(),
					params.getYear(), MonthlyDataConversor.toMap(params));
		} catch (final NoSolutionException e) {
			this.planningService.saveMonthInJson(params.getYear(), params.getMonth(), params.getMonthlyPlanningDtos());
			throw new NoSolutionException("Cambio no válido");
		}
	}

	@PostMapping("/checkWeekly")
	public void checkWeeklyPlanning(@Validated @RequestBody WeeklyDataDto params)
			throws IOException, ClassNotFoundException, NoSolutionException, PlanningNotGeneratedException {
		try {
			final List<Priority> costs = this.prioritiesService.getPriorities().get("Semanal");

			final Map<String, Map<Integer, String>> annualData = this.planningService
					.getYearFromJson(params.getYear(), true).get(0);
			final boolean yearChanged = this.isYearChanged(params.getMonth(), params.getDays());
			final Map<String, Map<Integer, String>> prevAnnualData = yearChanged
					? this.planningService.getYearFromJson(params.getYear() - 1, true).get(0)
					: null;

			final Month monthEnum = MONTH_TRANSLATION.get(params.getMonth().toUpperCase());
			final int daysInMonth = YearMonth.of(params.getYear(), monthEnum).lengthOfMonth();
			final MonthlyResultDto monthData = this
					.getMonthlyPlanning(params.getMonth(), params.getYear(), daysInMonth, true).get(0);

			if (params.getDays().contains(1)) {
				final Month monthEnum2 = MONTH_TRANSLATION.get(NEXT_MONTH.get(params.getMonth().toUpperCase()));
				final int daysInMonth2 = monthEnum2.equals(Month.JANUARY)
						? YearMonth.of(params.getYear() + 1, monthEnum2).lengthOfMonth()
						: YearMonth.of(params.getYear(), monthEnum2).lengthOfMonth();
				final String nextMonth = NEXT_MONTH.get(params.getMonth().toUpperCase());
				final String capitalized = nextMonth.substring(0, 1).toUpperCase()
						+ nextMonth.substring(1).toLowerCase();
				final MonthlyResultDto monthDataNext = this
						.getMonthlyPlanning(capitalized, params.getYear(), daysInMonth2, true).get(0);
				for (final MonthlyPlanningDto monthlyPlanningDto : monthData.getMonthlyPlanningDtos()) {
					final String worker = monthlyPlanningDto.getName();
					for (final MonthlyPlanningDto dtoNextMonth : monthDataNext.getMonthlyPlanningDtos()) {
						if (dtoNextMonth.getName().equals(worker)) {
							for (int i = 0; i < 8; i++) {
								monthlyPlanningDto.getAssignations().set(i, dtoNextMonth.getAssignations().get(i));
							}
						}
					}
				}
			}
			this.planningService.checkWeeklyPlanning(
					WeeklyDataConversor.toClingoParams(params, costs, annualData, prevAnnualData, monthData,
							params.getYear(), params.getMonth()),
					params.getYear(), params.getMonth(), params.getWeek(), params.getActivities(),
					WeeklyDataConversor.toMap(params));
		} catch (final NoSolutionException e) {
			this.planningService.saveWeekInJson(params.getYear(), params.getMonth(), params.getWeek(),
					params.getWeeklyPlanningDtos(), params.getActivities(), params.getDays());
			throw new NoSolutionException("Cambio no válido");
		}
	}

	private boolean isYearChanged(String month, List<Integer> days) {
		Integer prevDay = 0;
		boolean yearChanged = false;
		if (month.equalsIgnoreCase("ENERO")) {
			for (final Integer day : days) {
				if (day < prevDay) {
					yearChanged = true;
				}
				prevDay = day;
			}
		}
		return yearChanged;
	}
}
