package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;

import java.util.Map;

public interface PlanningService {

    Map<String, Map<Integer, String>> getAnnualPlanning(String params) throws NoSolutionException;

    Map<String, Map<Integer, String>> getMonthlyPlanning(String params, String month) throws NoSolutionException;

    Map<String, Map<Integer, String>> getWeeklyPlanning(String params) throws NoSolutionException;

    Map<String, Map<Integer, String>> getAnnualFromJson();
}
