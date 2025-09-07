import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const annualPlanning = (planningData, year, onSuccess, onErrors) =>
  appFetch(`/plannings/annual?year=${year}`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const getAnnualPlanning = (planningData, year, onSuccess, onErrors) =>
  appFetch(`/plannings/savedYearly?year=${year}`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const monthlyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/monthly`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const getMonthlyPlanning = (month, year, numDays, onSuccess, onErrors) =>
  appFetch(`/plannings/monthly?month=${month}&year=${year}&numDays=${numDays}`, fetchConfig("GET"), onSuccess, onErrors);

export const weeklyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/weekly`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const getWeeklyPlanning = (month, year, week, days, onSuccess, onErrors) =>
  appFetch(`/plannings/getWeekly?month=${month}&year=${year}&week=${week}`, fetchConfig("POST", days), onSuccess, onErrors);

export const saveWeeklyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/saveWeekly`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const saveMonthlyPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/saveMonthly`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const saveYearlyPlanning = (planningData, year, onSuccess, onErrors) =>
  appFetch(`/plannings/saveYearly?year=${year}`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const checkAnnualPlanning = (planningData, index, year, onSuccess, onErrors) =>
  appFetch(`/plannings/checkAnnual?year=${year}&index=${index}`, fetchConfig("POST", planningData), onSuccess, onErrors);

export const checkMonthlyPlanning = (planningData, index, onSuccess, onErrors) =>
  appFetch(`/plannings/checkMonthly?index=${index}`, fetchConfig("POST", planningData), onSuccess, onErrors);


export const checkWeeklyPlanning = (planningData, index, onSuccess, onErrors) =>
  appFetch(`/plannings/checkWeekly?index=${index}`, fetchConfig("POST", planningData), onSuccess, onErrors);
