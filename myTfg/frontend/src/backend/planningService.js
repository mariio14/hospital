import {
  fetchConfig,
  appFetch,
  setServiceToken,
  getServiceToken,
  removeServiceToken,
  setReauthenticationCallback,
} from "./appFetch";

export const annualPlanning = (params, onSuccess, onErrors) =>
  appFetch(`/plannings/annual`, fetchConfig("GET", params), onSuccess, onErrors);