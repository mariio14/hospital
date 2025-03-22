import * as actionTypes from './actionTypes';
import backend from '../../backend';

const getStaffCompleted = staffList => ({
    type: actionTypes.GET_STAFF_COMPLETED,
    staffList
});

export const getStaff = (onErrors) => dispatch =>
    backend.staffService.getStaff(
        staff => dispatch(getStaffCompleted(staff)), onErrors
    );

export const modifyStaff = (staffData, onErrors) => dispatch =>
    backend.staffService.modifyStaff(
        staffData,
        result => dispatch(getStaff(onErrors)), onErrors
    );

export const clearStaff = () => ({
    type: actionTypes.GET_STAFF_CLEAR,
});