import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';
import users, {Login, SignUp, UpdateProfile, ChangePassword, Logout} from '../../users';
import Home from "./Home";
import {PrioritiesList} from '../../priorities';


const Body = () => {


	const loggedIn = useSelector(users.selectors.isLoggedIn);
	const userId = useSelector(users.selectors.getUserId);

	return (
		<Routes>
			<Route path="/*" element={<Home />} />
			{!loggedIn && <Route path="/users/login" element={<Login />} />}
			{!loggedIn && <Route path="/users/signUp" element={<SignUp />} />}
			{loggedIn && <Route path="/users/update-profile" element={<UpdateProfile />} />}
			{loggedIn && <Route path="/users/change-password" element={<ChangePassword />} />}
			{loggedIn && <Route path="/users/logout" element={<Logout />} />}
			<Route path="/priorities" element={<PrioritiesList />} />
		</Routes>
	);
};

export default Body;
