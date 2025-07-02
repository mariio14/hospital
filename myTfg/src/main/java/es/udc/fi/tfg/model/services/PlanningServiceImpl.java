package es.udc.fi.tfg.model.services;

import java.io.*;
import java.util.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.model.services.exceptions.PlanningNotGeneratedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlanningServiceImpl implements PlanningService {

    @Autowired
    private StaffService staffService;

    private final String pathname = System.getProperty("user.dir") + "/src/main/java/es/udc/fi/tfg/model/services/clingo";

    @Override
    public Map<String, Map<Integer, String>> getAnnualPlanning(String params, int year) throws NoSolutionException{
        String command = "python decode_yearly.py yearly.lp input_yearly.lp";

        try {
            writeInputFile(params, pathname + "/input_yearly.lp");

            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
            processBuilder.directory(new File(pathname));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Script ejecutado correctamente.");
                System.out.println("Salida del script (JSON): " + output);

                Map<String, Map<Integer, String>> planning = parseJson(output.toString());

                if (planning.isEmpty()) {
                    throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
                }

                saveYearJsonFile(planning, "/solution_yearly.json", year);

                return planning;
            }  else {
                System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
                throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
            }
        } catch (NoSolutionException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Map<Integer, String>> getMonthlyPlanning(String params, String month, int year) throws NoSolutionException {
        String command = "python decode_monthly.py monthly.lp input_monthly.lp";
        try {
            writeInputFile(params, pathname + "/input_monthly.lp");

            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
            processBuilder.directory(new File(pathname));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Script ejecutado correctamente.");
                System.out.println("Salida del script (JSON): " + output);

                Map<String, Map<Integer, String>> planning = parseJson(output.toString());

                if (planning.isEmpty()) {
                    throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
                }
                saveMonthToJsonFile(planning, "/solutionMonthly.json", month, year);

                return planning;
            }  else {
                System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
                throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
            }
        } catch (NoSolutionException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Map<Integer, String>> getWeeklyPlanning(String params, int year, String month, String week) throws NoSolutionException {
        String command = "python decode_weekly.py weekly.lp input_weekly.lp";
        try {
            writeInputFile(params, pathname + "/input_weekly.lp");

            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
            processBuilder.directory(new File(pathname));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Script ejecutado correctamente.");
                System.out.println("Salida del script (JSON): " + output);

                Map<String, Map<Integer, String>> planning = parseJson(output.toString());

                if (planning.isEmpty()) {
                    throw new NoSolutionException("Sin solucion para los parametros proporcionados.");
                }
                saveWeekToJsonFile(planning, "/solutionWeekly.json", year, month, week);

                return planning;
            }  else {
                System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
                throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
            }
        } catch (NoSolutionException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Map<Integer, String>> getMonthFromJson(String currentMonth, int year, boolean previous,
                                                              boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

        String month = currentMonth;
        if (previous) {
            if (Objects.equals(currentMonth, "Enero")) year++;
            month = getPreviousMonth(currentMonth);
        }
        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + "/solutionMonthly.json");

        Map<String, Map<String, Map<String, Map<Integer, String>>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {});
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }

        List<Staff> staffList =  staffService.getStaff();

        Map<String, Map<Integer, String>> yearData = existingData.get(String.valueOf(year)) != null
                ? existingData.get(String.valueOf(year)).get(month)
                : null;

        if (yearData != null) {
            return yearData;
        } else {
            if (throwException) {
                throw new PlanningNotGeneratedException("El planning del mes " + month + " del año " + year + " no ha sido generado.");
            }
            Map<String, Map<Integer, String>> emptyData = new HashMap<>();
            for (Staff staff : staffList) {
                emptyData.put(staff.getName(), new HashMap<>());
            }
            return emptyData;
        }
    }

    @Override
    public Map<String, Map<Integer, String>> getYearFromJson(int year, boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException {

        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + "/solution_yearly.json");

        Map<String, Map<String, Map<Integer, String>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {});
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }

        List<Staff> staffList =  staffService.getStaff();

        Map<String, Map<Integer, String>> yearData = existingData.get(String.valueOf(year));

        if (yearData != null) {
            return yearData;
        } else {
            if (throwException) {
                throw new PlanningNotGeneratedException("El planning del año " + year + " no ha sido generado.");
            }
            Map<String, Map<Integer, String>> emptyData = new HashMap<>();
            for (Staff staff : staffList) {
                Map<Integer, String> monthsMap = new HashMap<>();
                for (int month = 1; month <= 12; month++) {
                    monthsMap.put(month, null);
                }
                emptyData.put(staff.getName().toLowerCase(Locale.ROOT), monthsMap);
            }
            return emptyData;
        }
    }

    @Override
    public Map<String, Map<Integer, String>> getWeekFromJson(int year, String month, String week) throws IOException, ClassNotFoundException {
        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + "/solutionWeekly.json");

        Map<String, Map<String, Map<String, Map<String, Map<Integer, String>>>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {});
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }

        List<Staff> staffList =  staffService.getStaff();

        Map<String, Map<Integer, String>> weekData = existingData.get(String.valueOf(year)) != null
                ? existingData.get(String.valueOf(year)).get(month) != null
                    ? existingData.get(String.valueOf(year)).get(month).get(week)
                    : null
                : null;

        if (weekData != null) {
            return weekData;
        } else {
            Map<String, Map<Integer, String>> emptyData = new HashMap<>();
            for (Staff staff : staffList) {
                emptyData.put(staff.getName(), new HashMap<>());
            }
            return emptyData;
        }
    }

    private Map<String, Map<Integer, String>> parseJson(String jsonString) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonString, new TypeReference<>() {});
    }

    private void saveToJsonFile(Map<String, Map<Integer, String>> planning, String file) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            File outputFile = new File(pathname + file);
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, planning);
        } catch (Exception e) {
            System.err.println("Error al guardar el resultado en un archivo JSON.");
            e.printStackTrace();
        }
    }

    private void saveYearJsonFile(Map<String, Map<Integer, String>> planning, String file, int year) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<Integer, Map<String, Map<Integer, String>>> wrappedPlanning = new HashMap<>();
            wrappedPlanning.put(year, planning);
            File outputFile = new File(pathname + file);
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, wrappedPlanning);
        } catch (Exception e) {
            System.err.println("Error al guardar el resultado en un archivo JSON.");
            e.printStackTrace();
        }
    }


    private void saveMonthToJsonFile(Map<String, Map<Integer, String>> planning, String file, String month, int year) {
        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + file);
        Map<Integer, Map<String, Map<String, Map<Integer, String>>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {});
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }
        Map<String, Map<String, Map<Integer, String>>> yearMap = existingData.getOrDefault(year, new HashMap<>());
        yearMap.put(month, planning);
        existingData.put(year, yearMap);
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, existingData);
        } catch (Exception e) {
            System.err.println("Error al guardar el resultado en un archivo JSON.");
            e.printStackTrace();
        }
    }

    private void saveWeekToJsonFile(Map<String, Map<Integer, String>> planning, String file,
                                    int year, String month, String week) {
        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + file);
        Map<Integer, Map<String, Map<String, Map<String, Map<Integer, String>>>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {});
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }
        Map<String, Map<String, Map<String, Map<Integer, String>>>> yearMap = existingData.getOrDefault(year, new HashMap<>());
        Map<String, Map<String, Map<Integer, String>>> monthMap = yearMap.getOrDefault(month, new HashMap<>());
        monthMap.put(week, planning);
        yearMap.put(month, monthMap);
        existingData.put(year, yearMap);
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, existingData);
        } catch (Exception e) {
            System.err.println("Error al guardar el resultado en un archivo JSON.");
            e.printStackTrace();
        }
    }

    private void writeInputFile(String params, String outputFilePath) {
        try (FileWriter writer = new FileWriter(outputFilePath)) {
            writer.write(params);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al escribir el archivo de entrada LP", e);
        }
    }

    private String getPreviousMonth(String month) {
        Map<String, String> previousMonthMap = new HashMap<>();
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
