import { NetTypes, NumberXYLimit } from "../types/interfaces";
import { MIN_NET_SIZE, MAX_FIGURE_SIZE } from "./constants";
import randomInteget from "./randomInteger";

export default function generateFigures(num: number = MIN_NET_SIZE) {
	const alphabet = "ABCDEFGHIKLMNOPQRSTVXYZ";
	const arr: NetTypes[] = new Array(num);
	for (let i = 0; i < arr.length; i++) {
		let id = i + 1;

		let x = randomInteget(
			1,
			num <= MAX_FIGURE_SIZE ? num : MAX_FIGURE_SIZE
		) as NumberXYLimit;
		let y = randomInteget(
			1,
			num <= MAX_FIGURE_SIZE ? num : MAX_FIGURE_SIZE
		) as NumberXYLimit;

		arr[i] = {
			id: id,
			name: alphabet[id],
			empty: true,
			hidden: false,
			parentId: null,
			size: { x, y },
		};
	}
	return arr;
}
