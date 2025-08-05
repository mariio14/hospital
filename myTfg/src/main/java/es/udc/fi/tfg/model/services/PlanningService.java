package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.entities.ActivityAndPlanning;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.model.services.exceptions.PlanningNotGeneratedException;
import es.udc.fi.tfg.rest.dtos.ActivityDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PlanningService {

    Map<String, Map<Integer, String>> getAnnualPlanning(String params, int year) throws NoSolutionException;

    Map<String, Map<Integer, String>> getMonthlyPlanning(String params, String month, int year) throws NoSolutionException;

    Map<String, Map<Integer, List<String>>> getWeeklyPlanning(String params, int year, String month, String week, List<List<ActivityDto>> activities) throws NoSolutionException;

    Map<String, Map<Integer, String>> getMonthFromJson(String month, int year, boolean previous, boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    Map<String, Map<Integer, String>> getYearFromJson(int year, boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    ActivityAndPlanning getWeekFromJson(int year, String month, String week) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;
}
