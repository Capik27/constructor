export default function randomInteger(min: number, max: number): number {
	const rnd: number = min + Math.random() * (max + 1 - min);
	return Math.floor(rnd);
}
