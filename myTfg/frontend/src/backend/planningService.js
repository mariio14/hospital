import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const annualPlanning = (planningData, year, onSuccess, onErrors) =>
  appFetch(`/plannings/annual?year=${year}`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const monthlyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/monthly`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const getMonthlyPlanning = (month, year, numDays, onSuccess, onErrors) =>
  appFetch(`/plannings/monthly?month=${month}&year=${year}&numDays=${numDays}`, fetchConfig("GET"), onSuccess, onErrors);

export const weeklyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/weekly`, fetchConfig("POST", planningData), onSuccess, onErrors);