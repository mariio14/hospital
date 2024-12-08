import {combineReducers} from 'redux';

import users from '../modules/users';
import plannings from '../modules/plannings';

const rootReducer = combineReducers({
    users: users.reducer,
    plannings: plannings.reducer
});

export default rootReducer;