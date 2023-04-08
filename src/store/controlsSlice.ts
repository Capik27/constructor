import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	netSize: 3,
	gameStarted: false,
};

const controlsSlice = createSlice({
	name: "controls",
	initialState,
	reducers: {
		reset(state) {
			state.netSize = initialState.netSize;
			state.gameStarted = initialState.gameStarted;
		},
		setNetSize(state, action) {
			state.netSize = action.payload;
		},
		setGameStarted(state, action) {
			state.gameStarted = action.payload;
		},
	},
});

export default controlsSlice.reducer;
export const { reset, setNetSize, setGameStarted } = controlsSlice.actions;
