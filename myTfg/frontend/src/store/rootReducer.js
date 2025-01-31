import {combineReducers} from 'redux';

import users from '../modules/users';
import plannings from '../modules/plannings';
import priorities from '../modules/priorities';

const rootReducer = combineReducers({
    users: users.reducer,
    plannings: plannings.reducer,
    priorities: priorities.reducer,
});

export default rootReducer;