package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.entities.Priority;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PrioritiesService {

    Map<String, List<Priority>> getPriorities() throws IOException, ClassNotFoundException;

    void modifyPriority(String id, Integer cost) throws IOException, ClassNotFoundException;
}
