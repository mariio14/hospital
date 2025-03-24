package es.udc.fi.tfg.rest.dtos;

public class StaffDto {

    private String name;

    private Integer level;

    public StaffDto() {
    }

    public StaffDto(String name, Integer level) {
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
