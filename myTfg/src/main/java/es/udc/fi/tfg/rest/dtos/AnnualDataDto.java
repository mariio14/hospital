package es.udc.fi.tfg.rest.dtos;

import java.util.List;

public class AnnualDataDto {

    List<AnnualPlanningDataDto> assignations;

    public AnnualDataDto() {
    }

    public AnnualDataDto(List<AnnualPlanningDataDto> assignations) {
        this.assignations = assignations;
    }

    public List<AnnualPlanningDataDto> getAssignations() {
        return assignations;
    }

    public void setAssignations(List<AnnualPlanningDataDto> assignations) {
        this.assignations = assignations;
    }
}
