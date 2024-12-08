import {
  fetchConfig,
  appFetch,
  setServiceToken,
  getServiceToken,
  removeServiceToken,
  setReauthenticationCallback,
} from "./appFetch";

export const annualPlanning = (onSuccess, onErrors) =>
  appFetch(`/plannings/annual`, fetchConfig("POST"), onSuccess, onErrors);