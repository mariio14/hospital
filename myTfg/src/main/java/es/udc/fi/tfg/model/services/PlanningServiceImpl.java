package es.udc.fi.tfg.model.services;

import java.io.*;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlanningServiceImpl implements PlanningService {

    private final String pathname = System.getProperty("user.dir") + "/src/main/java/es/udc/fi/tfg/model/services/clingo";

    @Override
    public Map<String, Map<Integer, String>> getAnnualPlanning(String params) throws NoSolutionException{
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

                saveToJsonFile(planning, "/solution_yearly.json");

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
    public Map<String, Map<Integer, String>> getMonthlyPlanning(String params, String month) throws NoSolutionException {
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
                saveMonthToJsonFile(planning, "/solutionMonthly.json", month);

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
    public Map<String, Map<Integer, String>> getWeeklyPlanning(String params) throws NoSolutionException {
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
                saveToJsonFile(planning, "/solutionWeekly.json");

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
    public Map<String, Map<Integer, String>> getMonthFromJson(String currentMonth) {

        String month = getPreviousMonth(currentMonth);
        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + "/solutionMonthly.json");
        Map<String, Map<String, Map<Integer, String>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {
            });
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }
        return existingData.get(month) == null ? new HashMap<>() : existingData.get(month);
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

    private void saveMonthToJsonFile(Map<String, Map<Integer, String>> planning, String file, String month) {
        ObjectMapper mapper = new ObjectMapper();
        File outputFile = new File(pathname + file);
        Map<String, Map<String, Map<Integer, String>>> existingData = new HashMap<>();
        try {
            existingData = mapper.readValue(outputFile, new TypeReference<>() {
            });
        } catch (Exception e) {
            System.err.println("Error al leer el archivo JSON existente. Se usará un mapa vacío.");
        }

        existingData.put(month, planning);

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
