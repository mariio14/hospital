package es.udc.fi.tfg.model.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.fi.tfg.model.entities.Priority;
import es.udc.fi.tfg.rest.dtos.PriorityGroupDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrioritiesServiceImpl implements PrioritiesService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String filePath = "src/main/resources/priorities.json";
    private final String originalFilePath = "src/main/resources/original_priorities.json";

    @Override
    public Map<String, List<Priority>> getPriorities() throws IOException {
        byte[] jsonData = Files.readAllBytes(Paths.get(filePath));

        return objectMapper.readValue(jsonData, new TypeReference<>() {
        });
    }

    @Override
    public void modifyPriority(List<PriorityGroupDto> priorities) throws IOException, ClassNotFoundException {
        objectMapper.writeValue(Paths.get(filePath).toFile(), transformToMap(priorities));
    }

    @Override
    public void prioritiesToDefaultValue(String type) throws IOException {
        Map<String, List<Priority>> originalPriorities = objectMapper.readValue(
                Files.readAllBytes(Paths.get(originalFilePath)), new TypeReference<>() {
                });
        Map<String, List<Priority>> currentPriorities = objectMapper.readValue(
                Files.readAllBytes(Paths.get(filePath)), new TypeReference<>() {
                });

        if (originalPriorities.containsKey(type) && currentPriorities.containsKey(type)) {
            currentPriorities.get(type).clear();
            currentPriorities.get(type).addAll(originalPriorities.get(type));
        }

        objectMapper.writeValue(Paths.get(filePath).toFile(), currentPriorities);
    }

    public static Map<String, List<Priority>> transformToMap(List<PriorityGroupDto> priorities) {
        return priorities.stream()
                .collect(Collectors.toMap(
                        PriorityGroupDto::getType,
                        group -> group.getPriorities().stream()
                                .map(dto -> new Priority(dto.getId(), dto.getTitle(), dto.getCost()))
                                .collect(Collectors.toList())
                ));
    }
}
