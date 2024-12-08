const getModuleState = state => state.plannings;

export const getAnnualPlanning = state =>
    getModuleState(state).annualPlanning;