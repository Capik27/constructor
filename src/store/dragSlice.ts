import { createSlice } from "@reduxjs/toolkit";
import { NetTypes } from "../types/interfaces";
import generateFigures from "../models/generateFigures";
import { MIN_NET_SIZE } from "../utils/constants";

const base: NetTypes[] = generateFigures(MIN_NET_SIZE);

const initialState = {
	base,
	current: null,
	board: null,
};

const dragSlice = createSlice({
	name: "drag",
	initialState,
	reducers: {
		resetCurrent(state) {
			state.current = initialState.current;
			state.board = initialState.board;
		},
		resetBase(state) {
			state.base = initialState.base;
		},
		generateBase(state, action) {
			state.base = generateFigures(action.payload);
		},
		setCurrentDrag(state, action) {
			state.current = action.payload;
		},
		setBoard(state, action) {
			state.board = action.payload;
		},
		//////////////////////////////////////////////
		removeBaseItem(state, action) {
			// console.log("action.payload.id", action.payload);
			state.base = state.base.filter((item) => item.id !== action.payload);
		},
		swapBaseItems(state, action) {
			const { current, target } = action.payload;
			if (current.id === target.id) return;
			const newBase = [...state.base];
			newBase.forEach((item, index) => {
				if (item.id === target.id) {
					newBase[index] = { ...current, id: target.id };
				} else if (item.id === current.id) {
					newBase[index] = { ...target, id: current.id };
				}
			});
			state.base = newBase;
		},
		replaceBaseItem(state, action) {
			const { current, target } = action.payload;
			const newBase = [...state.base];
			newBase.forEach((item, index) => {
				if (item.id === current.id) {
					newBase[index] = { ...target, id: current.id, empty: true };
				}
			});
			state.base = newBase;
		},
	},
});

export default dragSlice.reducer;
export const {
	resetCurrent,
	resetBase,
	generateBase,
	setCurrentDrag,
	setBoard,
	removeBaseItem,
	swapBaseItems,
	replaceBaseItem,
} = dragSlice.actions;
