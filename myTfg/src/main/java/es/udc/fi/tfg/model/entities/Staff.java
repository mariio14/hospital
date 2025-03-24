package es.udc.fi.tfg.model.entities;

public class Staff {

    private String name;

    private Integer level;

    public Staff() {
    }

    public Staff(String name, Integer level) {
        this.name = name;
        this.level = level;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }
}
