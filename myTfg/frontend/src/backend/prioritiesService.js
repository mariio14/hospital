import {
  fetchConfig,
  appFetch,
} from "./appFetch";

export const modifyPriorities = (priorityData, onSuccess, onErrors) =>
  appFetch(`/priorities/modify`, fetchConfig("PUT", priorityData), onSuccess, onErrors);

export const originalPriorities = (groupType, onSuccess, onErrors) =>
  appFetch(`/priorities/original`, fetchConfig("PUT", groupType), onSuccess, onErrors);

export const getPriorities = (onSuccess, onErrors) =>
  appFetch(`/priorities`, fetchConfig("GET"), onSuccess, onErrors);