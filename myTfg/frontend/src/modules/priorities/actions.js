import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getPrioritiesCompleted = priorities => ({
    type: actionTypes.GET_PRIORITIES_COMPLETED,
    priorities
});

export const getPriorities = (onErrors) => dispatch =>
    backend.planningService.getPriorities(
    priorities => dispatch(getPrioritiesCompleted(priorities)), onErrors);

export const modifyPriority = (priorityData, onErrors) => dispatch =>
    backend.prioritiesService.modifyPriority(priorityData,
    result => dispatch(getPriorities(onErrors)), onErrors);

export const clearPriorities = () => ({
    type: actionTypes.GET_PRIORITIES_CLEAR,
});