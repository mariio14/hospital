import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getPrioritiesCompleted = prioritiesList => ({
    type: actionTypes.GET_PRIORITIES_COMPLETED,
    prioritiesList
});

export const getPriorities = (onErrors) => dispatch =>
    backend.prioritiesService.getPriorities(
        priorities => dispatch(getPrioritiesCompleted(priorities)), onErrors
    );

export const modifyPriorities = (priorityData, onErrors) => dispatch =>
    backend.prioritiesService.modifyPriorities(
        priorityData,
        result => dispatch(getPriorities(onErrors)), onErrors
    );

export const originalPriorities = (groupType, onSuccess, onErrors) => dispatch =>
    backend.prioritiesService.originalPriorities(
        groupType,
        onSuccess,
        onErrors
    );

export const clearPriorities = () => ({
    type: actionTypes.GET_PRIORITIES_CLEAR,
});