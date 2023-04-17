export type IdType = number | null;
export type NumberXYLimit = 1 | 2 | 3 | 4 | 5;

export interface NetTypes {
	id: number;
	name: string;
	empty: boolean;
	hidden: boolean;
	size: SizeXY;
	parentId: IdType;
	targets: IdType[];
	square: number;
}

export interface SizeXY {
	x: NumberXYLimit;
	y: NumberXYLimit;
}

export interface ITargets {
	targets: IdType[];
	enable: boolean;
}
