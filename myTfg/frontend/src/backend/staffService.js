import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const modifyStaff = (staffData, onSuccess, onErrors) =>
  appFetch(`/staff/modify`, fetchConfig("PUT", staffData), onSuccess, onErrors);

export const getStaff = (onSuccess, onErrors) =>
  appFetch(`/staff`, fetchConfig("GET"), onSuccess, onErrors);