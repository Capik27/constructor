export interface NetTypes {
	id: number;
	name: string;
	empty: boolean;
	hidden: boolean;
	size: SizeXY;
}

export type NumberXYLimit = 1 | 2 | 3;

interface SizeXY {
	x: NumberXYLimit;
	y: NumberXYLimit;
}
