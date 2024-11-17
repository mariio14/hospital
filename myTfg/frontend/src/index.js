import React from 'react';
import {HashRouter} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


import './index.css';

import { App } from "./modules/app";
import {Provider} from 'react-redux';
import store from './store';
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist"
import {createRoot} from "react-dom/client";
import {IntlProvider} from 'react-intl';

const container = document.getElementById("root")
const root = createRoot(container)
let persistor = persistStore(store)


root.render(
	<IntlProvider locale='es'>
		<HashRouter>
		 	<Provider store={store}>
				<PersistGate persistor={persistor}>
					<App />
				</PersistGate>
		 	</Provider>
		 </HashRouter>
	 </IntlProvider>
	 )