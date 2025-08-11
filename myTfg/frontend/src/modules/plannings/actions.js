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
    () => dispatch(getWeeklyConfirmCompleted(planningData)), onErrors);

export const getWeeklyClear = weeklyPlanning => ({
    type: actionTypes.CLEAR_WEEKLY_LIST,
    weeklyPlanning
});

const getMonthlyConfirmCompleted = monthlyPlanning => ({
    type: actionTypes.MONTHLY_CONFIRM_COMPLETED,
    monthlyPlanning
});

export const saveMonthlyPlanning = (planningData, onErrors) => dispatch =>
    backend.planningService.saveMonthlyPlanning(planningData,
    () => dispatch(getMonthlyConfirmCompleted(planningData)), onErrors);

export const getMonthlyClear = monthlyPlanning => ({
    type: actionTypes.CLEAR_MONTHLY_LIST,
    monthlyPlanning
});

const getYearlyConfirmCompleted = annualPlanning => ({
    type: actionTypes.YEARLY_CONFIRM_COMPLETED,
    annualPlanning
});

export const saveYearlyPlanning = (planningData, year, onErrors) => dispatch =>
    backend.planningService.saveYearlyPlanning(planningData, year,
    () => dispatch(getYearlyConfirmCompleted(planningData)), onErrors);

export const checkAnnualPlanning = (planningData, year, onSuccess, onErrors) => dispatch =>
    backend.planningService.checkAnnualPlanning(planningData, year,
    onSuccess, onErrors);

export const checkMonthlyPlanning = (planningData, onSuccess, onErrors) => dispatch =>
    backend.planningService.checkMonthlyPlanning(planningData,
    onSuccess, onErrors);

export const checkWeeklyPlanning = (planningData, onSuccess, onErrors) => dispatch =>
    backend.planningService.checkWeeklyPlanning(planningData,
    onSuccess, onErrors);