package es.udc.fi.tfg.model.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.fi.tfg.model.entities.ActivityAndPlanning;
import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.model.services.exceptions.PlanningNotGeneratedException;
import es.udc.fi.tfg.rest.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.util.*;

@Service
@Transactional
public class PlanningServiceImpl implements PlanningService {

	@Autowired
	private StaffService staffService;

	private final String pathname = System.getProperty("user.dir")
			+ "/src/main/java/es/udc/fi/tfg/model/services/clingo";

	private static final Map<String, String> COLORS = Map.ofEntries(Map.entry("rojo", "red"),
			Map.entry("amarillo", "yellow"), Map.entry("azul", "blue"));

	private static final Map<String, String> CONSTANTS_MAP = Map.ofEntries(Map.entry("red", "ROJOS"),
			Map.entry("yellow", "AMARILLO"), Map.entry("blue", "COLON"), Map.entry("pink", "MAMA"),
			Map.entry("purple", "URGENCIAS"), Map.entry("green", "PARED"), Map.entry("brown", "PROCTO"),
			Map.entry("other", "OTRAS"), Map.entry("xray", "RAYOS"), Map.entry("rea", "REA"),
			Map.entry("thoracic", "TORACICA"), Map.entry("valencia", "VALENCIA"), Map.entry("vascular", "VASCULAR"),
			Map.entry("nutrition", "NUTRI"));

	private static final Map<String, String> TASKS = Map.ofEntries(Map.entry("PLANTA", "floor"), Map.entry("QX", "qx"),
			Map.entry("CONSULTA", "consultation"), Map.entry("CARCA", "carca"), Map.entry("EXPE", "cerdo"),
			Map.entry("QXROBOT", "qxrobot"));

	@Override
	public List<Map<String, Map<Integer, String>>> getAnnualPlanning(String params, int year)
			throws NoSolutionException {
		final String command = "python decode_yearly.py yearly.lp input_yearly.lp";

		try {
			this.writeInputFile(params, this.pathname + "/input_yearly.lp");

			final ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
			processBuilder.directory(new File(this.pathname));
			processBuilder.redirectErrorStream(true);

			final Process process = processBuilder.start();

			final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			final StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
			}

			final int exitCode = process.waitFor();
			if (exitCode == 0) {
				System.out.println("Script ejecutado correctamente.");
				System.out.println("Salida del script (JSON): " + output);

				final List<Map<String, Map<Integer, String>>> planning = this.parseJson(output.toString());

				if (planning.isEmpty()) {
					throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
				}

				this.saveYearJsonFile(planning, "/solution_yearly.json", year);

				return planning;
			} else {
				System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
				throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
			}
		} catch (final NoSolutionException e) {
			throw e;
		} catch (final Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<Map<String, Map<Integer, String>>> getMonthlyPlanning(String params, String month, int year)
			throws NoSolutionException {
		final String command = "python decode_monthly.py monthly.lp input_monthly.lp";
		try {
			this.writeInputFile(params, this.pathname + "/input_monthly.lp");

			final ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
			processBuilder.directory(new File(this.pathname));
			processBuilder.redirectErrorStream(true);

			final Process process = processBuilder.start();

			final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			final StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
			}

			final int exitCode = process.waitFor();
			if (exitCode == 0) {
				System.out.println("Script ejecutado correctamente.");
				System.out.println("Salida del script (JSON): " + output);

				final List<Map<String, Map<Integer, String>>> planning = this.parseJson(output.toString());

				if (planning.isEmpty()) {
					throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
				}
				this.saveMonthToJsonFile(planning, "/solutionMonthly.json", month, year);

				return planning;
			} else {
				System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
				throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
			}
		} catch (final NoSolutionException e) {
			throw e;
		} catch (final Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<Map<String, Map<Integer, List<String>>>> getWeeklyPlanning(String params, int year, String month,
			String week, List<List<ActivityDto>> activities) throws NoSolutionException {
		final String command = "python decode_weekly.py weekly_open.lp input_weekly.lp";
		try {
			this.writeInputFile(params, this.pathname + "/input_weekly.lp");

			final ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
			processBuilder.directory(new File(this.pathname));
			processBuilder.redirectErrorStream(true);

			final Process process = processBuilder.start();

			final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			final StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
			}

			final int exitCode = process.waitFor();
			if (exitCode == 0) {
				System.out.println("Script ejecutado correctamente.");
				System.out.println("Salida del script (JSON): " + output);

				final List<Map<String, Map<Integer, List<String>>>> planning = this.parseJsonToList(output.toString());

				if (planning.isEmpty()) {
					throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
				}
				this.saveWeekToJsonFile(planning, "/solutionWeekly.json", year, month, week, activities);

				return planning;
			} else {
				System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
				throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
			}
		} catch (final NoSolutionException e) {
			throw e;
		} catch (final Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public List<Map<String, Map<Integer, String>>> getMonthFromJson(String currentMonth, int year, boolean previous,
			boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		String month = currentMonth;
		if (previous) {
			if (Objects.equals(currentMonth, "Enero"))
				year++;
			month = this.getPreviousMonth(currentMonth);
		}
		final ObjectMapper mapper = new ObjectMapper();
		final File outputFile = new File(this.pathname + "/solutionMonthly.json");

		Map<String, Map<String, List<Map<String, Map<Integer, String>>>>> existingData = new HashMap<>();
		try {
			existingData = mapper.readValue(outputFile, new TypeReference<>() {
			});
		} catch (final Exception e) {
			System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
		}

		final List<Staff> staffList = this.staffService.getStaff();

		final List<Map<String, Map<Integer, String>>> yearData = existingData.get(String.valueOf(year)) != null
				? existingData.get(String.valueOf(year)).get(month)
				: null;

		if (yearData != null) {
			return yearData;
		} else {
			if (throwException) {
				throw new PlanningNotGeneratedException(
						"El planning del mes " + month + " del año " + year + " no ha sido generado.");
			}
			final List<Map<String, Map<Integer, String>>> emptyData = new ArrayList<>();
			final Map<String, Map<Integer, String>> emptyMonthData = new HashMap<>();
			for (final Staff staff : staffList) {
				emptyMonthData.put(staff.getName(), new HashMap<>());
			}
			emptyData.add(emptyMonthData);
			return emptyData;
		}
	}

	@Override
	public List<Map<String, Map<Integer, String>>> getYearFromJson(int year, boolean throwException)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

		final ObjectMapper mapper = new ObjectMapper();
		final File outputFile = new File(this.pathname + "/solution_yearly.json");

		Map<String, List<Map<String, Map<Integer, String>>>> existingData = new HashMap<>();
		try {
			existingData = mapper.readValue(outputFile, new TypeReference<>() {
			});
		} catch (final Exception e) {
			System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
		}

		final List<Staff> staffList = this.staffService.getStaff();

		final List<Map<String, Map<Integer, String>>> yearData = existingData.get(String.valueOf(year));

		if (yearData != null) {
			return yearData;
		} else {
			if (throwException) {
				throw new PlanningNotGeneratedException("El planning del año " + year + " no ha sido generado.");
			}
			final List<Map<String, Map<Integer, String>>> emptyData = new ArrayList<>();
			final Map<String, Map<Integer, String>> emptyYearData = new HashMap<>();
			for (final Staff staff : staffList) {
				final Map<Integer, String> monthsMap = new HashMap<>();
				for (int month = 1; month <= 12; month++) {
					monthsMap.put(month, null);
				}
				emptyYearData.put(staff.getName().toLowerCase(Locale.ROOT), monthsMap);
			}
			emptyData.add(emptyYearData);
			return emptyData;
		}
	}

	@Override
	public ActivityAndPlanning getWeekFromJson(int year, String month, String week, boolean yearChanged)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {
		final ObjectMapper mapper = new ObjectMapper();
		final File outputFile = new File(this.pathname + "/solutionWeekly.json");
		final File activitiesFile = new File(this.pathname + "/activities.json");

		Map<String, Map<String, Map<String, List<Map<String, Map<Integer, List<String>>>>>>> existingData = new HashMap<>();
		Map<Integer, Map<String, Map<String, List<List<ActivityDto>>>>> activitiesData = new HashMap<>();
		try {
			existingData = mapper.readValue(outputFile, new TypeReference<>() {
			});
		} catch (final Exception e) {
			System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
		}
		try {
			activitiesData = mapper.readValue(activitiesFile, new TypeReference<>() {
			});
		} catch (final Exception e) {
			System.err.println("Error al leer el archivo de actividades existente. Se usará un mapa vacío.");
		}

		final List<Staff> staffList = this.staffService.getStaff();

		List<Map<String, Map<Integer, List<String>>>> weekData = existingData.get(String.valueOf(year)) != null
				? existingData.get(String.valueOf(year)).get(month) != null
						? existingData.get(String.valueOf(year)).get(month).get(week)
						: null
				: null;

		if (weekData == null) {
			final List<Map<String, Map<Integer, List<String>>>> emptyData = new ArrayList<>();
			final Map<String, Map<Integer, List<String>>> map = new HashMap<>();
			for (final Staff staff : staffList) {
				map.put(staff.getName(), new HashMap<>());
			}
			emptyData.add(map);
			weekData = emptyData;
		}

		final List<List<ActivityDto>> emptyList = List.of(this.getFloors(), this.getFloors(), this.getFloors(),
				this.getFloors(), this.getFloors());
		final List<List<ActivityDto>> activitiesDataForWeek = activitiesData.getOrDefault(year, new HashMap<>())
				.getOrDefault(month, new HashMap<>()).getOrDefault(week, emptyList);

		return new ActivityAndPlanning(activitiesDataForWeek, weekData, this.getYearFromJson(year, false).get(0),
				yearChanged ? this.getYearFromJson(year - 1, false).get(0) : new HashMap<>(),
				this.getMonthFromJson(month, year, false, false).get(0));
	}

	@Override
	public void saveWeekInJson(int year, String month, String week, List<WeeklyAssignationsDto> planning,
			List<List<ActivityDto>> activities, List<Integer> days)
			throws IOException, ClassNotFoundException, PlanningNotGeneratedException {
		final List<Map<String, Map<Integer, List<String>>>> result = new ArrayList<>();
		final Map<String, Map<Integer, List<String>>> weekMap = new HashMap<>();
		for (final WeeklyAssignationsDto weeklyAssignationsDto : planning) {
			final String name = weeklyAssignationsDto.getName().toLowerCase(Locale.ROOT);
			final Map<Integer, List<String>> assignationsMap = new HashMap<>();
			int i = 0;
			for (final String assignation : weeklyAssignationsDto.getAssignations()) {
				if (assignation != null) {
					final String[] partes = assignation.split("_");
					final String st;
					if (partes.length == 1 && assignation.startsWith("PLANTA/")) {
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i)).add("morningfloor_yellow");
							assignationsMap.get(days.get(i)).add("morningqx_yellow");
						} else {
							assignationsMap.put(days.get(i),
									new ArrayList<>(List.of("morningfloor_yellow", "morningqx_yellow")));
						}
					} else if (partes.length == 2 && assignation.startsWith("PLANTA/")) {
						st = partes[1].toLowerCase(Locale.ROOT);
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i)).add("morningfloor_yellow");
							assignationsMap.get(days.get(i)).add("morningqx_yellow_" + st);
						} else {
							assignationsMap.put(days.get(i),
									new ArrayList<>(List.of("morningfloor_yellow", "morningqx_yellow_" + st)));
						}
					} else if (partes.length == 2 && partes[0].equals("V")) {
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i)).add("v");
						} else {
							assignationsMap.put(days.get(i), new ArrayList<>(List.of("v")));
						}
					} else if (partes.length == 1 && partes[0].equals("V")) {
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i)).add("v");
						} else {
							assignationsMap.put(days.get(i), new ArrayList<>(List.of("v")));
						}
					} else if (partes.length == 2) {
						final String color = COLORS.get(partes[1]);
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i))
									.add("morning" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color);
						} else {
							assignationsMap.put(days.get(i), new ArrayList<>(
									List.of("morning" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color)));
						}
					} else {
						final String a = "morning" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_"
								+ COLORS.get(partes[1]) + "_" + partes[2].toLowerCase(Locale.ROOT);
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i)).add(a);
						} else {
							assignationsMap.put(days.get(i), new ArrayList<>(List.of(a)));
						}
					}
				}
				i++;
			}
			i = 0;
			for (final String assignation : weeklyAssignationsDto.getEveningAssignations()) {
				if (assignation != null) {
					final String[] partes = assignation.split("_");
					if (partes.length > 1 && partes[0] == null || partes[0].isEmpty() || partes[0].equals("null")) {
						i++;
						continue;
					}
					if (partes.length == 2) {
						final String color = COLORS.get(partes[1]);
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i))
									.add("evening" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color);
						} else {
							assignationsMap.put(days.get(i), new ArrayList<>(
									List.of("evening" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color)));
						}
					} else if (partes.length == 1) {
						i++;
						continue;
					} else {
						final String a = "evening" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_"
								+ COLORS.get(partes[1]) + "_" + partes[2].toLowerCase(Locale.ROOT);
						if (assignationsMap.containsKey(days.get(i))) {
							assignationsMap.get(days.get(i)).add(a);
						} else {
							assignationsMap.put(days.get(i), new ArrayList<>(List.of(a)));
						}
					}
				}
				i++;
			}
			weekMap.put(name, assignationsMap);
		}
		result.add(weekMap);
		this.saveWeekToJsonFile(result, "/solutionWeekly.json", year, month, week, activities);
	}

	@Override
	public void saveWeekListInJson(int year, String month, String week, List<WeeklyDataDto> planning, List<List<ActivityDto>> activities,
								   List<Integer> days) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {
		final List<Map<String, Map<Integer, List<String>>>> result = new ArrayList<>();
		for (WeeklyDataDto weeklyDataDto : planning) {
			final Map<String, Map<Integer, List<String>>> weekMap = new HashMap<>();
			for (final WeeklyAssignationsDto weeklyAssignationsDto : weeklyDataDto.getWeeklyPlanningDtos()) {
				final String name = weeklyAssignationsDto.getName().toLowerCase(Locale.ROOT);
				final Map<Integer, List<String>> assignationsMap = new HashMap<>();
				int i = 0;
				for (final String assignation : weeklyAssignationsDto.getAssignations()) {
					if (assignation != null) {
						final String[] partes = assignation.split("_");
						final String st;
						if (partes.length == 1 && assignation.startsWith("PLANTA/")) {
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i)).add("morningfloor_yellow");
								assignationsMap.get(days.get(i)).add("morningqx_yellow");
							} else {
								assignationsMap.put(days.get(i),
										new ArrayList<>(List.of("morningfloor_yellow", "morningqx_yellow")));
							}
						} else if (partes.length == 2 && assignation.startsWith("PLANTA/")) {
							st = partes[1].toLowerCase(Locale.ROOT);
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i)).add("morningfloor_yellow");
								assignationsMap.get(days.get(i)).add("morningqx_yellow_" + st);
							} else {
								assignationsMap.put(days.get(i),
										new ArrayList<>(List.of("morningfloor_yellow", "morningqx_yellow_" + st)));
							}
						} else if (partes.length == 2 && partes[0].equals("V")) {
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i)).add("v");
							} else {
								assignationsMap.put(days.get(i), new ArrayList<>(List.of("v")));
							}
						} else if (partes.length == 1 && partes[0].equals("V")) {
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i)).add("v");
							} else {
								assignationsMap.put(days.get(i), new ArrayList<>(List.of("v")));
							}
						} else if (partes.length == 2) {
							final String color = COLORS.get(partes[1]);
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i))
										.add("morning" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color);
							} else {
								assignationsMap.put(days.get(i), new ArrayList<>(
										List.of("morning" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color)));
							}
						} else {
							final String a = "morning" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_"
									+ COLORS.get(partes[1]) + "_" + partes[2].toLowerCase(Locale.ROOT);
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i)).add(a);
							} else {
								assignationsMap.put(days.get(i), new ArrayList<>(List.of(a)));
							}
						}
					}
					i++;
				}
				i = 0;
				for (final String assignation : weeklyAssignationsDto.getEveningAssignations()) {
					if (assignation != null) {
						final String[] partes = assignation.split("_");
						if (partes.length > 1 && partes[0] == null || partes[0].isEmpty() || partes[0].equals("null")) {
							i++;
							continue;
						}
						if (partes.length == 2) {
							final String color = COLORS.get(partes[1]);
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i))
										.add("evening" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color);
							} else {
								assignationsMap.put(days.get(i), new ArrayList<>(
										List.of("evening" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_" + color)));
							}
						} else if (partes.length == 1) {
							i++;
							continue;
						} else {
							final String a = "evening" + TASKS.get(partes[0].toUpperCase(Locale.ROOT)) + "_"
									+ COLORS.get(partes[1]) + "_" + partes[2].toLowerCase(Locale.ROOT);
							if (assignationsMap.containsKey(days.get(i))) {
								assignationsMap.get(days.get(i)).add(a);
							} else {
								assignationsMap.put(days.get(i), new ArrayList<>(List.of(a)));
							}
						}
					}
					i++;
				}
				weekMap.put(name, assignationsMap);
			}
			result.add(weekMap);
		}
		this.saveWeekToJsonFile(result, "/solutionWeekly.json", year, month, week, activities);
	}

	@Override
	public void saveMonthInJson(int year, String month, List<MonthlyAssignationsDto> planning) {
		final List<Map<String, Map<Integer, String>>> result = new ArrayList<>();
		final Map<String, Map<Integer, String>> monthMap = new HashMap<>();

		for (final MonthlyAssignationsDto monthlyAssignationsDto : planning) {
			final String name = monthlyAssignationsDto.getName().toLowerCase(Locale.ROOT);
			final Map<Integer, String> assignationsMap = new HashMap<>();
			int i = 1;
			for (final String assignation : monthlyAssignationsDto.getAssignations()) {
				if (assignation != null) {
					assignationsMap.put(i, assignation);
				}
				i++;
			}
			monthMap.put(name, assignationsMap);
		}

		result.add(monthMap);
		this.saveMonthToJsonFile(result, "/solutionMonthly.json", month, year);
	}

	@Override
	public void saveMonthListInJson(int year, String month, List<MonthlyDataDto> planning) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {
		final List<Map<String, Map<Integer, String>>> result = new ArrayList<>();
		for (MonthlyDataDto monthlyDataDto : planning) {
			final Map<String, Map<Integer, String>> monthMap = new HashMap<>();

			for (final MonthlyAssignationsDto monthlyAssignationsDto : monthlyDataDto.getMonthlyPlanningDtos()) {
				final String name = monthlyAssignationsDto.getName().toLowerCase(Locale.ROOT);
				final Map<Integer, String> assignationsMap = new HashMap<>();
				int i = 1;
				for (final String assignation : monthlyAssignationsDto.getAssignations()) {
					if (assignation != null) {
						assignationsMap.put(i, assignation);
					}
					i++;
				}
				monthMap.put(name, assignationsMap);
			}

			result.add(monthMap);
		}
		this.saveMonthToJsonFile(result, "/solutionMonthly.json", month, year);
	}

	@Override
	public void saveYearInJson(int year, AnnualDataDto planning) {
		final List<Map<String, Map<Integer, String>>> result = new ArrayList<>();
		final Map<String, Map<Integer, String>> yearMap = new HashMap<>();
		for (final AnnualPlanningDataDto annualPlanningDataDto : planning.getAssignations()) {
			final String name = annualPlanningDataDto.getName().toLowerCase(Locale.ROOT);
			final Map<Integer, String> assignationsMap = new HashMap<>();
			int i = 1;
			for (final String assignation : annualPlanningDataDto.getAssignations()) {
				if (assignation != null) {
					final String key = CONSTANTS_MAP.entrySet().stream()
							.filter(entry -> entry.getValue().equals(assignation)).map(Map.Entry::getKey).findFirst()
							.orElse("unknown");
					assignationsMap.put(i, key);
				}
				i++;
			}
			yearMap.put(name, assignationsMap);
		}

		result.add(yearMap);
		this.saveYearJsonFile(result, "/solution_yearly.json", year);
	}

	@Override
	public void saveYearListInJson(int year, List<AnnualDataDto> plannings) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {
		final List<Map<String, Map<Integer, String>>> result = new ArrayList<>();
		for (AnnualDataDto planning : plannings) {
			final Map<String, Map<Integer, String>> yearMap = new HashMap<>();
			for (final AnnualPlanningDataDto annualPlanningDataDto : planning.getAssignations()) {
				final String name = annualPlanningDataDto.getName().toLowerCase(Locale.ROOT);
				final Map<Integer, String> assignationsMap = new HashMap<>();
				int i = 1;
				for (final String assignation : annualPlanningDataDto.getAssignations()) {
					if (assignation != null) {
						final String key = CONSTANTS_MAP.entrySet().stream()
								.filter(entry -> entry.getValue().equals(assignation)).map(Map.Entry::getKey).findFirst()
								.orElse("unknown");
						assignationsMap.put(i, key);
					}
					i++;
				}
				yearMap.put(name, assignationsMap);
			}
			result.add(yearMap);
		}
		this.saveYearJsonFile(result, "/solution_yearly.json", year);
	}

	@Override
	public void checkAnnualPlanning(String params, int year, List<Map<String, Map<Integer, String>>> map)
			throws NoSolutionException {
		final String command = "python decode_yearly.py yearly_restrictions.lp input_yearly.lp";

		try {
			this.writeInputFile(params, this.pathname + "/input_yearly.lp");

			final ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
			processBuilder.directory(new File(this.pathname));
			processBuilder.redirectErrorStream(true);

			final Process process = processBuilder.start();

			final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			final StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
			}

			final int exitCode = process.waitFor();
			if (exitCode == 0) {
				System.out.println("Script ejecutado correctamente.");
				System.out.println("Salida del script (JSON): " + output);

				final List<Map<String, Map<Integer, String>>> planning = this.parseJson(output.toString());
				if (planning.isEmpty()) {
					throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
				}
				this.saveYearJsonFile(map, "/solution_yearly.json", year);
			} else {
				System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
				throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
			}
		} catch (final NoSolutionException e) {
			throw e;
		} catch (final Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void checkMonthlyPlanning(String params, String month, int year, List<Map<String, Map<Integer, String>>> map)
			throws NoSolutionException {
		final String command = "python decode_monthly.py monthly_restrictions.lp input_monthly.lp";
		try {
			this.writeInputFile(params, this.pathname + "/input_monthly.lp");

			final ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
			processBuilder.directory(new File(this.pathname));
			processBuilder.redirectErrorStream(true);

			final Process process = processBuilder.start();

			final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			final StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
			}

			final int exitCode = process.waitFor();
			if (exitCode == 0) {
				System.out.println("Script ejecutado correctamente.");
				System.out.println("Salida del script (JSON): " + output);

				final List<Map<String, Map<Integer, String>>> planning = this.parseJson(output.toString());

				if (planning.isEmpty()) {
					throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
				}
				this.saveMonthToJsonFile(map, "/solutionMonthly.json", month, year);
			} else {
				System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
				throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
			}
		} catch (final NoSolutionException e) {
			throw e;
		} catch (final Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void checkWeeklyPlanning(String params, int year, String month, String week,
			List<List<ActivityDto>> activities, List<Map<String, Map<Integer, List<String>>>> map)
			throws NoSolutionException {
		final String command = "python decode_weekly.py weekly_restrictions.lp input_weekly.lp";
		try {
			this.writeInputFile(params, this.pathname + "/input_weekly.lp");

			final ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
			processBuilder.directory(new File(this.pathname));
			processBuilder.redirectErrorStream(true);

			final Process process = processBuilder.start();

			final BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			final StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
			}

			final int exitCode = process.waitFor();
			if (exitCode == 0) {
				System.out.println("Script ejecutado correctamente.");
				System.out.println("Salida del script (JSON): " + output);

				final List<Map<String, Map<Integer, List<String>>>> planning = this.parseJsonToList(output.toString());

				if (planning.isEmpty()) {
					throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
				}
				this.saveWeekToJsonFile(map, "/solutionWeekly.json", year, month, week, activities);
			} else {
				System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
				throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
			}
		} catch (final NoSolutionException e) {
			throw e;
		} catch (final Exception e) {
			e.printStackTrace();
		}
	}

	private List<ActivityDto> getFloors() {
		final List<ActivityDto> floors = new ArrayList<>();
		floors.add(new ActivityDto("PLANTA", "blue", 1, "morning", null));
		floors.add(new ActivityDto("PLANTA", "red", 1, "morning", null));
		floors.add(new ActivityDto("PLANTA", "yellow", 1, "morning", null));
		return floors;
	}

	private List<Map<String, Map<Integer, String>>> parseJson(String jsonString) throws Exception {
		final ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(jsonString, new TypeReference<>() {
		});
	}

	private List<Map<String, Map<Integer, List<String>>>> parseJsonToList(String jsonString) throws Exception {
		final ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(jsonString, new TypeReference<>() {
		});
	}

	private void saveYearJsonFile(List<Map<String, Map<Integer, String>>> planning, String file, int year) {
		final ObjectMapper mapper = new ObjectMapper();
		try {
			final Map<Integer, List<Map<String, Map<Integer, String>>>> wrappedPlanning = new HashMap<>();
			wrappedPlanning.put(year, planning);
			final File outputFile = new File(this.pathname + file);
			mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, wrappedPlanning);
		} catch (final Exception e) {
			System.err.println("Error al guardar el resultado en un archivo JSON.");
			e.printStackTrace();
		}
	}

	private void saveMonthToJsonFile(List<Map<String, Map<Integer, String>>> planning, String file, String month,
			int year) {
		final ObjectMapper mapper = new ObjectMapper();
		final File outputFile = new File(this.pathname + file);
		Map<Integer, Map<String, List<Map<String, Map<Integer, String>>>>> existingData = new HashMap<>();
		try {
			existingData = mapper.readValue(outputFile, new TypeReference<>() {
			});
		} catch (final Exception e) {
			System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
		}
		final Map<String, List<Map<String, Map<Integer, String>>>> yearMap = existingData.getOrDefault(year,
				new HashMap<>());
		yearMap.put(month, planning);
		existingData.put(year, yearMap);
		try {
			mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, existingData);
		} catch (final Exception e) {
			System.err.println("Error al guardar el resultado en un archivo JSON.");
			e.printStackTrace();
		}
	}

	private void saveWeekToJsonFile(List<Map<String, Map<Integer, List<String>>>> planning, String file, int year,
			String month, String week, List<List<ActivityDto>> activities) {
		final ObjectMapper mapper = new ObjectMapper();
		final File outputFile = new File(this.pathname + file);
		final File activitiesFile = new File(this.pathname + "/activities.json");
		Map<Integer, Map<String, Map<String, List<Map<String, Map<Integer, List<String>>>>>>> existingData = new HashMap<>();
		final Map<Integer, Map<String, Map<String, List<List<ActivityDto>>>>> activitiesData = new HashMap<>();
		try {
			existingData = mapper.readValue(outputFile, new TypeReference<>() {
			});
		} catch (final Exception e) {
			System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
		}
		final Map<String, Map<String, List<Map<String, Map<Integer, List<String>>>>>> yearMap = existingData
				.getOrDefault(year, new HashMap<>());
		final Map<String, List<Map<String, Map<Integer, List<String>>>>> monthMap = yearMap.getOrDefault(month,
				new HashMap<>());
		monthMap.put(week, planning);
		yearMap.put(month, monthMap);
		existingData.put(year, yearMap);

		final Map<String, Map<String, List<List<ActivityDto>>>> yearMapActivities = activitiesData.getOrDefault(year,
				new HashMap<>());
		final Map<String, List<List<ActivityDto>>> monthMapActivities = yearMapActivities.getOrDefault(month,
				new HashMap<>());
		monthMapActivities.put(week, activities);
		yearMapActivities.put(month, monthMapActivities);
		activitiesData.put(year, yearMapActivities);
		try {
			mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, existingData);
		} catch (final Exception e) {
			System.err.println("Error al guardar el resultado en un archivo JSON.");
			e.printStackTrace();
		}
		try {
			mapper.writerWithDefaultPrettyPrinter().writeValue(activitiesFile, activitiesData);
		} catch (final Exception e) {
			System.err.println("Error al guardar las actividades en un archivo JSON.");
			e.printStackTrace();
		}
	}

	private void writeInputFile(String params, String outputFilePath) {
		try (final FileWriter writer = new FileWriter(outputFilePath)) {
			writer.write(params);
		} catch (final IOException e) {
			e.printStackTrace();
			throw new RuntimeException("Error al escribir el archivo de entrada LP", e);
		}
	}

	private String getPreviousMonth(String month) {
		final Map<String, String> previousMonthMap = new HashMap<>();
		previousMonthMap.put("Enero", "Diciembre");
		previousMonthMap.put("Febrero", "Enero");
		previousMonthMap.put("Marzo", "Febrero");
		previousMonthMap.put("Abril", "Marzo");
		previousMonthMap.put("Mayo", "Abril");
		previousMonthMap.put("Junio", "Mayo");
		previousMonthMap.put("Julio", "Junio");
		previousMonthMap.put("Agosto", "Julio");
		previousMonthMap.put("Septiembre", "Agosto");
		previousMonthMap.put("Octubre", "Septiembre");
		previousMonthMap.put("Noviembre", "Octubre");
		previousMonthMap.put("Diciembre", "Noviembre");

		return previousMonthMap.getOrDefault(month, "Enero");
	}
}
