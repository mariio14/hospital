package es.udc.fi.tfg.model.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.IOException;
import java.lang.InterruptedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.udc.fi.tfg.model.util.PlanningType;

@Service
@Transactional
public class PlanningServiceImpl implements PlanningService{

    private String pathname = "/home/mario/AAAAAAAAAAAAAAAAAAAAA/hospital/myTfg/src/main/java/es/udc/fi/tfg/model/services/clingo";

    @Override
    public void getPlanning(PlanningType planningType) {
        String command = "python3 decode2.py yearly.lp";

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(command.split(" "));
            processBuilder.directory(new File(pathname));
            processBuilder.redirectErrorStream(true); // Redirigir errores a la salida estándar

            Process process = processBuilder.start();

            // Leer salida estándar
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }

            // Leer salida de error
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            StringBuilder errorOutput = new StringBuilder();
            while ((line = errorReader.readLine()) != null) {
                errorOutput.append(line).append(System.lineSeparator());
            }

            // Esperar a que el proceso termine
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Script ejecutado correctamente.");
                System.out.println("Salida del script: ");
                System.out.println(output.toString());
            } else {
                System.err.println("Error en la ejecución del script. Código de salida: " + exitCode);
                System.err.println("Errores del script: ");
                System.err.println(errorOutput.toString());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    
    private String resolveInputFile(PlanningType planningType) {
        switch (planningType) {
            case WEEKLY:
                return "weekly_schedule.lp";
            case MONTHLY:
                return "monthly_schedule.lp";
            case ANNUAL:
                return "yearly.lp";
            default:
                throw new IllegalArgumentException("Tipo de planificación no soportado: " + planningType);
        }
    }
}
