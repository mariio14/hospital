package es.udc.fi.tfg.model.services;

import java.util.Map;

public interface PlanningService {

    Map<String, Map<Integer, String>> getAnnualPlanning(String params);

    Map<String, Map<Integer, String>> getWeeklyPlanning();
}
