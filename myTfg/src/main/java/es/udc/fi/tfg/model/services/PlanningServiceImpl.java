package es.udc.fi.tfg.model.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlanningServiceImpl implements PlanningService {

    // private final String pathname = "/home/mario/TFG/hospital/myTfg/src/main/java/es/udc/fi/tfg/model/services/clingo";
    private final String pathname = "C:/Users/mario/hospital/myTfg/src/main/java/es/udc/fi/tfg/model/services/clingo";
    @Override
    public Map<Integer, Map<Integer, String>> getAnnualPlanning() {
        String command = "python decode.py yearly.lp";

        try {
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

                Map<Integer, Map<Integer, String>> planning = parseJson(output.toString());

                saveToJsonFile(planning);

                return planning;
            }  else {
                System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
                throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Map<Integer, String>> getWeeklyPlanning() {
        String command = "python decode.py weekly.lp";
        return Map.of();
    }

    private Map<Integer, Map<Integer, String>> parseJson(String jsonString) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonString, new TypeReference<>() {});
    }

    private void saveToJsonFile(Map<Integer, Map<Integer, String>> planning) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            File outputFile = new File(pathname + "/solution.json");
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, planning);
            System.out.println("Resultado guardado en el archivo: " + outputFile.getAbsolutePath());
        } catch (Exception e) {
            System.err.println("Error al guardar el resultado en un archivo JSON.");
            e.printStackTrace();
        }
    }
}
