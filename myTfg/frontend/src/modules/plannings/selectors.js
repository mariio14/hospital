const getModuleState = state => state.plannings;

export const getAnnualPlanning = state =>
    getModuleState(state).annualPlanning;

export const getMonthlyPlanning = state =>
    getModuleState(state).monthlyPlanning;

export const getWeeklyPlanning = state =>
    getModuleState(state).weeklyPlanning;