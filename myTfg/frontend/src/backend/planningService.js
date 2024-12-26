import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const annualPlanning = (planningData, onSuccess, onErrors) =>
  appFetch(`/plannings/annual`, fetchConfig("POST", planningData), onSuccess, onErrors);