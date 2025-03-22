import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    staffList: []
};

const staffList = (state = initialState.staffList, action) => {
    switch (action.type) {
        case actionTypes.GET_STAFF_COMPLETED:
            return action.prioritiesList;
        case actionTypes.GET_STAFF_CLEAR:
            return [];
        default:
            return state;
    }
}

const reducer = combineReducers({
    staffList
});

export default reducer;