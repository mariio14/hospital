import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';
import Home from "./Home";
import {PrioritiesList} from '../../priorities';
import {StaffList} from '../../staff';


const Body = () => {

	return (
		<Routes>
			<Route path="/*" element={<Home />} />
			<Route path="/priorities" element={<PrioritiesList />} />
			<Route path="/staff" element={<StaffList />} />
		</Routes>
	);
};

export default Body;
