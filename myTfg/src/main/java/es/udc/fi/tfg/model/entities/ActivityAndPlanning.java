package es.udc.fi.tfg.model.entities;

import es.udc.fi.tfg.rest.dtos.ActivityDto;

import java.util.List;
import java.util.Map;

public class ActivityAndPlanning {

    private List<List<ActivityDto>> activities;

    private List<Map<String, Map<Integer, List<String>>>> planning;

    private Map<String, Map<Integer, String>> annualData;

    private Map<String, Map<Integer, String>> prevAnnualData;

    public ActivityAndPlanning(List<List<ActivityDto>> activities, List<Map<String, Map<Integer, List<String>>>> planning,
                               Map<String, Map<Integer, String>> annualData, Map<String, Map<Integer, String>> prevAnnualData) {
        this.activities = activities;
        this.planning = planning;
        this.annualData = annualData;
        this.prevAnnualData = prevAnnualData;
    }

    public List<List<ActivityDto>> getActivities() {
        return activities;
    }

    public void setActivities(List<List<ActivityDto>> activities) {
        this.activities = activities;
    }

    public List<Map<String, Map<Integer, List<String>>>> getPlanning() {
        return planning;
    }

    public void setPlanning(List<Map<String, Map<Integer, List<String>>>> planning) {
        this.planning = planning;
    }

    public Map<String, Map<Integer, String>> getAnnualData() {
        return annualData;
    }

    public void setAnnualData(Map<String, Map<Integer, String>> annualData) {
        this.annualData = annualData;
    }

    public Map<String, Map<Integer, String>> getPrevAnnualData() {
        return prevAnnualData;
    }

    public void setPrevAnnualData(Map<String, Map<Integer, String>> prevAnnualData) {
        this.prevAnnualData = prevAnnualData;
    }
}
