package es.udc.fi.tfg.model.services;

import java.util.Map;

import es.udc.fi.tfg.model.util.PlanningType;

public interface PlanningService {

    Map<Integer, Map<Integer, String>> getPlanning(PlanningType planningType);
}
