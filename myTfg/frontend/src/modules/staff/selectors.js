const getModuleState = state => state.staff;

export const getStaffList = state =>
    getModuleState(state).staffList;
