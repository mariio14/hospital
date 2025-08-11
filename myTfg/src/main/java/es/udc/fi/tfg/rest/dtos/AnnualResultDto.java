package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class AnnualResultDto {

    private List<AnnualPlanningDto> assignations;

    private Boolean complete;

    public AnnualResultDto() {
    }

    public AnnualResultDto(List<AnnualPlanningDto> assignations, Boolean complete) {
        this.assignations = assignations;
        this.complete = complete;
    }

    public List<AnnualPlanningDto> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<AnnualPlanningDto> assignations) {
        this.assignations = assignations;
    }

    public Boolean getComplete() {
        return complete;
    }

    public void setComplete(Boolean complete) {
        this.complete = complete;
    }
}
