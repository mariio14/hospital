import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import * as actions from '../actions';

const AnnualPlaning = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(actions.getAnnualPlanning());
    }, [dispatch]);

    return(
        <div>AA</div>
    );
};

export default AnnualPlaning;