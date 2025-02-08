package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.entities.Priority;
import es.udc.fi.tfg.rest.dtos.PriorityGroupDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PrioritiesService {

    Map<String, List<Priority>> getPriorities() throws IOException, ClassNotFoundException;

    void modifyPriority(List<PriorityGroupDto> priorities) throws IOException, ClassNotFoundException;

    void prioritiesToDefaultValue(String type) throws IOException;
}
