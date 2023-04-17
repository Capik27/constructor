// import { Figure } from "../classes/Figure";
import { NetTypes, NumberXYLimit, SizeXY } from "../types/interfaces";
import { MIN_NET_SIZE, MAX_FIGURE_SIZE } from "../utils/constants";
import randomInteget from "../utils/randomInteger";
import { getFigureSquare, getFigureTargetsCoordinates } from "./FigureMethods";

export default function generateFigures(
	num: number = MIN_NET_SIZE
): NetTypes[] {
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

		let size: SizeXY = { x, y };

		arr[i] = {
			id,
			size,
			name: alphabet[id],
			empty: true,
			hidden: false,
			parentId: null,
			square: getFigureSquare(size),
			targets: getFigureTargetsCoordinates(size, num),
		};
	}
	//console.log(arr);
	return arr;
}
