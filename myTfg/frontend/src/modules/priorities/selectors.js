const getModuleState = state => state.priorities;

export const getPrioritiesList = state =>
    getModuleState(state).prioritiesList;
