import { configureStore, combineReducers } from "@reduxjs/toolkit";
import controlsSlice from "./controlsSlice";
import dragSlice from "./dragSlice";

const rootReducer = combineReducers({
	controls: controlsSlice,
	drag: dragSlice,
});

export const store = configureStore({ reducer: rootReducer });
