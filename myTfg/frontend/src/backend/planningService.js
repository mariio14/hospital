import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const annualPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/annual`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const monthlyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/monthly`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const weeklyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/weekly`, fetchConfig("POST", planningData), onSuccess, onErrors);