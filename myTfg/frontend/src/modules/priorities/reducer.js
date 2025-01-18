import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    prioritiesList: []
};

const prioritiesList = (state = initialState.prioritiesList, action) => {
    switch (action.type) {
        case actionTypes.GET_PRIORITIES_COMPLETED:
            return action.prioritiesList;
        case actionTypes.GET_PRIORITIES_CLEAR:
            return [];
        default:
            return state;
    }
}

const reducer = combineReducers({
    prioritiesList
});

export default reducer;