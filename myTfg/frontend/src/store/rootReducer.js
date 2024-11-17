import {combineReducers} from 'redux';

import users from '../modules/users';

const rootReducer = combineReducers({
    users: users.reducer
});

export default rootReducer;