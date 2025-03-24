package es.udc.fi.tfg.model.services;

import java.io.*;
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
        String command = "python decode.py yearly.lp input.lp";

        try {
            writeInputFile(params, pathname + "/input.lp");

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
        String command = "python decode.py weekly.lp";
        try {
            writeInputFile(params, pathname + "/inputMonthly.lp");

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
                saveToJsonFile(planning, "/solutionMonthly.json");

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
        String command = "python decode.py weekly.lp";
        try {
            writeInputFile(params, pathname + "/inputWeekly.lp");

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
    public Map<String, Map<Integer, String>> getAnnualFromJson() {
        return Map.of();
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

    private void writeInputFile(String params, String outputFilePath) {
        try (FileWriter writer = new FileWriter(outputFilePath)) {
            writer.write(params);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al escribir el archivo de entrada LP", e);
        }
    }
}
