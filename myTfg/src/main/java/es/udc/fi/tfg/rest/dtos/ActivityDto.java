package es.udc.fi.tfg.rest.dtos;

public class ActivityDto {

    private String type;

    private String color;

    private int slots;

    private String time;

    private String identifier;

    public ActivityDto() {
    }

    public ActivityDto(String type, String color, int slots, String time, String identifier) {
        this.type = type;
        this.color = color;
        this.slots = slots;
        this.time = time;
        this.identifier = identifier;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getSlots() {
        return slots;
    }

    public void setSlots(int slots) {
        this.slots = slots;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}
