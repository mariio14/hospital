import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getAnnualPlanningCompleted = annualPlanning => ({
    type: actionTypes.ANNUAL_PLANNING_COMPLETED,
    annualPlanning
});

export const getAnnualPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.annualPlanning(planningData,
    annualPlanning => dispatch(getAnnualPlanningCompleted(annualPlanning)), onErrors);

export const clearAnnualPlanning = () => ({
    type: actionTypes.ANNUAL_PLANNING_CLEAR,
});

const getMonthlyPlanningCompleted = monthlyPlanning => ({
    type: actionTypes.MONTHLY_PLANNING_COMPLETED,
    monthlyPlanning
});

export const getMonthlyPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.monthlyPlanning(planningData,
    monthlyPlanning => dispatch(getMonthlyPlanningCompleted(monthlyPlanning)), onErrors);


const getWeeklyPlanningCompleted = weeklyPlanning => ({
    type: actionTypes.WEEKLY_PLANNING_COMPLETED,
    weeklyPlanning
});

export const getWeeklyPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.weeklyPlanning(planningData,
    weeklyPlanning => dispatch(getWeeklyPlanningCompleted(weeklyPlanning)), onErrors);