package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;

import java.io.IOException;
import java.util.Map;

public interface PlanningService {

    Map<String, Map<Integer, String>> getAnnualPlanning(String params, int year) throws NoSolutionException;

    Map<String, Map<Integer, String>> getMonthlyPlanning(String params, String month, int year) throws NoSolutionException;

    Map<String, Map<Integer, String>> getWeeklyPlanning(String params) throws NoSolutionException;

    Map<String, Map<Integer, String>> getMonthFromJson(String month, int year, boolean previous) throws IOException, ClassNotFoundException;
}
