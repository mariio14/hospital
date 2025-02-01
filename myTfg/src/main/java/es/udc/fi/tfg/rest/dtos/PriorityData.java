package es.udc.fi.tfg.rest.dtos;

public class PriorityData {

    private String id;

    private Integer cost;

    public PriorityData() {
    }

    public PriorityData(String id, Integer cost) {
        this.id = id;
        this.cost = cost;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }
}
