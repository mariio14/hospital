package es.udc.fi.tfg.model.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.fi.tfg.model.entities.Priority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PrioritiesServiceImpl implements PrioritiesService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String filePath = "src/main/resources/priorities.json";

    @Override
    public Map<String, List<Priority>> getPriorities() throws IOException {
        byte[] jsonData = Files.readAllBytes(Paths.get(filePath));

        return objectMapper.readValue(jsonData, new TypeReference<>() {
        });
    }

    @Override
    public void modifyPriority(String id, Integer cost) throws IOException, ClassNotFoundException {
        Map<String, List<Priority>> priorities = getPriorities();

        boolean updated = false;
        for (List<Priority> priorityList : priorities.values()) {
            for (Priority priority : priorityList) {
                if (priority.getId().equals(id)) {
                    priority.setCost(cost);
                    updated = true;
                    break;
                }
            }
            if (updated) break;
        }

        if (updated) {
            objectMapper.writeValue(Paths.get(filePath).toFile(), priorities);
        }
    }
}
