package es.udc.fi.tfg.model.entities;

import es.udc.fi.tfg.rest.dtos.ActivityDto;

import java.util.List;
import java.util.Map;

public class ActivityAndPlanning {

    private List<List<ActivityDto>> activities;

    private Map<String, Map<Integer, List<String>>> planning;

    public ActivityAndPlanning(List<List<ActivityDto>> activities, Map<String, Map<Integer, List<String>>> planning) {
        this.activities = activities;
        this.planning = planning;
    }

    public List<List<ActivityDto>> getActivities() {
        return activities;
    }

    public void setActivities(List<List<ActivityDto>> activities) {
        this.activities = activities;
    }

    public Map<String, Map<Integer, List<String>>> getPlanning() {
        return planning;
    }

    public void setPlanning(Map<String, Map<Integer, List<String>>> planning) {
        this.planning = planning;
    }
}
