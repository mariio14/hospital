import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    annualPlanning: null
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

const reducer = combineReducers({
    annualPlanning
});

export default reducer;