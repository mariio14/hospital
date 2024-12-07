package es.udc.fi.tfg.model.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.udc.fi.tfg.model.util.PlanningType;

@Service
@Transactional
public class PlanningServiceImpl implements PlanningService {

    private final String pathname = "/home/mario/AAAAAAAAAAAAAAAAAAAAA/hospital/myTfg/src/main/java/es/udc/fi/tfg/model/services/clingo";

    @Override
    public Map<Integer, Map<Integer, String>> getPlanning(PlanningType planningType) {
        String command = "python3 decode.py " + resolveInputFile(planningType);

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
            processBuilder.directory(new File(pathname));
            processBuilder.redirectErrorStream(true); // Redirigir errores a la salida estándar

            Process process = processBuilder.start();

            // Capturar la salida estándar del proceso
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            // Esperar a que el proceso termine
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Script ejecutado correctamente.");
                System.out.println("Salida del script (JSON): " + output);

                return parseJson(output.toString());
            }  else {
                System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
                throw new RuntimeException("El script Python falló con código de salida: " + exitCode);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private Map<Integer, Map<Integer, String>> parseJson(String jsonString) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonString, new TypeReference<>() {});
    }

    private String resolveInputFile(PlanningType planningType) {
        return switch (planningType) {
            case WEEKLY -> "weekly_schedule.lp";
            case MONTHLY -> "monthly_schedule.lp";
            case ANNUAL -> "yearly.lp";
        };
    }
}
