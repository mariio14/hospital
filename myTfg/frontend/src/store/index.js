import {configureStore} from '@reduxjs/toolkit'

import rootReducer from './rootReducer';
import storage from "redux-persist/lib/storage"
import {persistReducer} from "redux-persist"
import {FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist/es/constants";

const persistConfig = {
    key: "root",
    version: 1,
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(),
});

export default store;