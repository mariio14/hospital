import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    annualPlanning: null,
    monthlyPlanning: null,
    weeklyPlanning: null
};

const annualPlanning = (state = initialState.annualPlanning, action) => {
    switch (action.type) {
        case actionTypes.ANNUAL_PLANNING_COMPLETED:
            return action.annualPlanning;
        case actionTypes.ANNUAL_PLANNING_CLEAR:
            return null;
        default:
            return state;
    }
}

const monthlyPlanning = (state = initialState.monthlyPlanning, action) => {
    switch (action.type) {
        case actionTypes.MONTHLY_PLANNING_COMPLETED:
            return action.monthlyPlanning;
        default:
            return state;
    }
}

const weeklyPlanning = (state = initialState.weeklyPlanning, action) => {
    switch (action.type) {
        case actionTypes.WEEKLY_PLANNING_COMPLETED:
            return action.weeklyPlanning;
        default:
            return state;
    }
}

const reducer = combineReducers({
    annualPlanning,
    monthlyPlanning,
    weeklyPlanning
});

export default reducer;