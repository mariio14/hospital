package es.udc.fi.tfg.model.services;

import java.util.Map;

public interface PlanningService {

    Map<Integer, Map<Integer, String>> getAnnualPlanning();

    Map<String, Map<Integer, String>> getWeeklyPlanning();
}
