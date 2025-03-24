package es.udc.fi.tfg.model.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import es.udc.fi.tfg.model.entities.Staff;
import es.udc.fi.tfg.rest.dtos.StaffDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
@Transactional
public class StaffServiceImpl implements StaffService{

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String filePath = "src/main/resources/staff.json";

    @Override
    public List<Staff> getStaff() throws IOException, ClassNotFoundException {
        byte[] jsonData = Files.readAllBytes(Paths.get(filePath));

        return objectMapper.readValue(jsonData, new TypeReference<>() {});
    }

    @Override
    public void modifyStaff(List<StaffDto> staffList) throws IOException, ClassNotFoundException {
        objectMapper.writeValue(Paths.get(filePath).toFile(), staffList);
    }
}
