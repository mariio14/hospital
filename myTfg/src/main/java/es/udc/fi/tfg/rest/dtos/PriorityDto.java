package es.udc.fi.tfg.rest.dtos;

public class PriorityDto {

    private String id;

    private String title;

    private Integer cost;

    public PriorityDto() {
    }

    public PriorityDto(String id, String title, Integer cost) {
        this.id = id;
        this.title = title;
        this.cost = cost;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }
}
