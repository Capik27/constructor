export interface NetTypes {
	id: number;
	name: string;
	empty: boolean;
	hidden: boolean;
	size: SizeXY;
	parentId: number | null;
}

export type NumberXYLimit = 1 | 2 | 3 | 4 | 5;

export interface SizeXY {
	x: NumberXYLimit;
	y: NumberXYLimit;
}
