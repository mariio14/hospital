import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getAnnualPlanningCompleted = annualPlanning => ({
    type: actionTypes.ANNUAL_PLANNING_COMPLETED,
    annualPlanning
});

export const getAnnualPlanning = (planningData, year, onErrors) => dispatch =>
    backend.planningService.annualPlanning(planningData, year,
    annualPlanning => dispatch(getAnnualPlanningCompleted(annualPlanning)), onErrors);

export const getSavedAnnualPlanning = (planningData, year, onErrors, emptyPlanning) => dispatch =>
    backend.planningService.getAnnualPlanning(
        planningData,
        year,
        annualPlanning => {
            if (annualPlanning != null && !(annualPlanning instanceof Blob)) {
                dispatch(getAnnualPlanningCompleted(annualPlanning));
            } else {
                dispatch(getAnnualPlanningCompleted(emptyPlanning));
            }
        },
        onErrors
    );

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

export const getSavedMonthlyPlanning = (month, year, numDays, onErrors) => dispatch =>
    backend.planningService.getMonthlyPlanning(month, year, numDays,
    monthlyPlanning => dispatch(getMonthlyPlanningCompleted(monthlyPlanning)), onErrors);

const getWeeklyPlanningCompleted = weeklyPlanning => ({
    type: actionTypes.WEEKLY_PLANNING_COMPLETED,
    weeklyPlanning
});

export const getWeeklyPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.weeklyPlanning(planningData,
    weeklyPlanning => dispatch(getWeeklyPlanningCompleted(weeklyPlanning)), onErrors);

export const getSavedWeeklyPlanning = (month, year, week, onErrors) => dispatch =>
    backend.planningService.getWeeklyPlanning(month, year, week,
    weeklyPlanning => dispatch(getWeeklyPlanningCompleted(weeklyPlanning)), onErrors);

const getWeeklyConfirmCompleted = weeklyPlanning => ({
    type: actionTypes.WEEKLY_CONFIRM_COMPLETED,
    weeklyPlanning
});

export const saveWeeklyPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.saveWeeklyPlanning(planningData,
    weeklyPlanning => dispatch(getWeeklyConfirmCompleted(weeklyPlanning)), onErrors);

export const getWeeklyClear = weeklyPlanning => ({
    type: actionTypes.CLEAR_WEEKLY_LIST,
    weeklyPlanning
});