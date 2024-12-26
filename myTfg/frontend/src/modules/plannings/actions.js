import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getAnnualPlanningCompleted = annualPlanning => ({
    type: actionTypes.ANNUAL_PLANNING_COMPLETED,
    annualPlanning
});

export const getAnnualPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.annualPlanning(planningData,
    annualPlanning => dispatch(getAnnualPlanningCompleted(annualPlanning)), onErrors);