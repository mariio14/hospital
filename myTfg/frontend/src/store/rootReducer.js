import {combineReducers} from 'redux';

import plannings from '../modules/plannings';
import priorities from '../modules/priorities';
import staff from '../modules/staff';

const rootReducer = combineReducers({
    plannings: plannings.reducer,
    priorities: priorities.reducer,
    staff: staff.reducer
});

export default rootReducer;