import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import userEvent from "@testing-library/user-event";
import {loginMock} from "./mocks/login.mock";
import {HashRouter} from "react-router-dom";
import {App} from "../modules/app";

describe("App tests ", () => {

    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    let store;
    store = mockStore(loginMock);


    it("renders with all its elements", async () => {
        /*render(
            <Provider store={store}>
                <HashRouter>
                    <App/>
                </HashRouter>
            </Provider>
        );*/
    });


});