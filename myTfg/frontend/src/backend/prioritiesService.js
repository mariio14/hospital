import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const modifyPriority = (priorityData, onSuccess, onErrors) =>
  appFetch(`/priorities/modify`, fetchConfig("PUT", priorityData), onSuccess, onErrors);

export const getPriorities = (onSuccess, onErrors) =>
  appFetch(`/priorities`, fetchConfig("GET"), onSuccess, onErrors);