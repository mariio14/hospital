package es.udc.fi.tfg.model.services;

import es.udc.fi.tfg.model.entities.ActivityAndPlanning;
import es.udc.fi.tfg.model.services.exceptions.NoSolutionException;
import es.udc.fi.tfg.model.services.exceptions.PlanningNotGeneratedException;
import es.udc.fi.tfg.rest.dtos.ActivityDto;
import es.udc.fi.tfg.rest.dtos.AnnualPlanningDataDto;
import es.udc.fi.tfg.rest.dtos.MonthlyAssignationsDto;
import es.udc.fi.tfg.rest.dtos.WeeklyAssignationsDto;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PlanningService {

    List<Map<String, Map<Integer, String>>> getAnnualPlanning(String params, int year) throws NoSolutionException;

    List<Map<String, Map<Integer, String>>> getMonthlyPlanning(String params, String month, int year) throws NoSolutionException;

    List<Map<String, Map<Integer, List<String>>>> getWeeklyPlanning(String params, int year, String month, String week, List<List<ActivityDto>> activities) throws NoSolutionException;

    List<Map<String, Map<Integer, String>>> getMonthFromJson(String month, int year, boolean previous, boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    List<Map<String, Map<Integer, String>>> getYearFromJson(int year, boolean throwException) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    ActivityAndPlanning getWeekFromJson(int year, String month, String week) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    void saveWeekInJson(int year, String month, String week, List<WeeklyAssignationsDto> planning,
                        List<List<ActivityDto>> activities, List<Integer> days) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    void saveMonthInJson(int year, String month, List<MonthlyAssignationsDto> planning) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    void saveYearInJson(int year, List<AnnualPlanningDataDto> planning) throws IOException, ClassNotFoundException, PlanningNotGeneratedException;

    void checkAnnualPlanning(String params, int year, List<Map<String, Map<Integer, String>>> map) throws NoSolutionException;

    void checkMonthlyPlanning(String params, String month, int year, List<Map<String, Map<Integer, String>>> map) throws NoSolutionException;

    void checkWeeklyPlanning(String params, int year, String month, String week, List<List<ActivityDto>> activities, List<Map<String, Map<Integer, List<String>>>> map) throws NoSolutionException;

}
