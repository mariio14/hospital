const getModuleState = state => state.plannings;

export const getAnnualPlanning = state =>
    getModuleState(state).annualPlanning;

export const getMonthlyPlanning = state =>
    getModuleState(state).monthlyPlanning;

export const getWeeklyPlanning = state =>
    getModuleState(state).weeklyPlanning;

export const getWeeklyPlanningList = state =>
    getModuleState(state).weeklyPlanningList;

export const getMonthlyPlanningList = state =>
    getModuleState(state).monthlyPlanningList;

export const getAnnualPlanningList = state =>
    getModuleState(state).annualPlanningList;