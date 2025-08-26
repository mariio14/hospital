import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    annualPlanning: null,
    annualPlanningList: [],
    monthlyPlanning: null,
    monthlyPlanningList: [],
    weeklyPlanning: null,
    weeklyPlanningList: []
};

const annualPlanning = (state = initialState.annualPlanning, action) => {
    switch (action.type) {
        case actionTypes.ANNUAL_PLANNING_COMPLETED:
            return action.annualPlanning[0];
        case actionTypes.ANNUAL_PLANNING_CLEAR:
            return null;
        case actionTypes.YEARLY_CHECK_COMPLETED:
            return action.annualPlanning;
        default:
            return state;
    }
}

const annualPlanningList = (state = initialState.annualPlanningList, action) => {
    switch (action.type) {
        case actionTypes.ANNUAL_PLANNING_COMPLETED:
            return action.annualPlanning;
        case actionTypes.YEARLY_CONFIRM_COMPLETED:
            return [];
        case actionTypes.YEARLY_CHECK_COMPLETED:
            return [action.annualPlanning];
        case actionTypes.ANNUAL_PLANNING_CLEAR:
            return [];
        default:
            return state;
    }
}

const monthlyPlanning = (state = initialState.monthlyPlanning, action) => {
    switch (action.type) {
        case actionTypes.MONTHLY_PLANNING_COMPLETED:
            return action.monthlyPlanning[0];
        case actionTypes.MONTHLY_CONFIRM_COMPLETED:
            return action.monthlyPlanning;
        case actionTypes.CLEAR_MONTHLY_LIST:
            return action.monthlyPlanning;
        case actionTypes.MONTHLY_CHECK_COMPLETED:
            return action.monthlyPlanning;
        default:
            return state;
    }
}

const monthlyPlanningList = (state = initialState.monthlyPlanningList, action) => {
    switch (action.type) {
        case actionTypes.MONTHLY_PLANNING_COMPLETED:
            return action.monthlyPlanning;
        case actionTypes.MONTHLY_CONFIRM_COMPLETED:
            return [];
        case actionTypes.MONTHLY_CHECK_COMPLETED:
            return [action.monthlyPlanning];
        case actionTypes.CLEAR_MONTHLY_LIST:
            return [];
        default:
            return state;
    }
}

const weeklyPlanning = (state = initialState.weeklyPlanning, action) => {
    switch (action.type) {
        case actionTypes.WEEKLY_PLANNING_COMPLETED:
            return action.weeklyPlanning[0];
        case actionTypes.WEEKLY_CONFIRM_COMPLETED:
            return action.weeklyPlanning;
        case actionTypes.CLEAR_WEEKLY_LIST:
            return action.weeklyPlanning;
        case actionTypes.WEEKLY_CHECK_COMPLETED:
            return action.weeklyPlanning;
        default:
            return state;
    }
}

const weeklyPlanningList = (state = initialState.weeklyPlanningList, action) => {
    switch (action.type) {
        case actionTypes.WEEKLY_PLANNING_COMPLETED:
            return action.weeklyPlanning;
        case actionTypes.WEEKLY_CONFIRM_COMPLETED:
            return [];
        case actionTypes.CLEAR_WEEKLY_LIST:
            return [];
        case actionTypes.WEEKLY_CHECK_COMPLETED:
            return [action.weeklyPlanning];
        default:
            return state;
    }
}

const reducer = combineReducers({
    annualPlanning,
    annualPlanningList,
    monthlyPlanning,
    monthlyPlanningList,
    weeklyPlanning,
    weeklyPlanningList
});

export default reducer;