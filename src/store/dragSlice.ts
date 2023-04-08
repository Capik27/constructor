import { createSlice } from "@reduxjs/toolkit";
import { NetTypes, NumberXYLimit } from "../types/interfaces";

const sd = "ABCDEFGHIKLMNOPQRSTVXYZ";
const base: NetTypes[] = new Array(8);
for (let i = 0; i < base.length; i++) {
	let id = i + 1;

	let m = Math.random();
	let x_size: NumberXYLimit = m < 0.33 ? 1 : m < 0.66 ? 2 : 3;

	base[i] = {
		id: id,
		name: sd[id],
		empty: true,
		hidden: false,
		size: { x: x_size, y: 1 },
	};
}

const initialState = {
	base: base,
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
	setCurrentDrag,
	setBoard,
	removeBaseItem,
	swapBaseItems,
	replaceBaseItem,
} = dragSlice.actions;
