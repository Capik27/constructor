import { SizeXY } from "../types/interfaces";
import { MIN_NET_SIZE } from "../utils/constants";

/**
 * Функция вернёт отсортированный массив коорданат, которые нужно проверять при наведении на блок поля
 * @param size объект с полями "x" и "y"
 * @param limit размер стороны поля(квадрата)
 */
export function getFigureTargetsCoordinates(
	size: SizeXY,
	limit: number = MIN_NET_SIZE
): number[] {
	const result: number[] = [];
	for (let x = 0; x < size.x; x++) {
		result.push(x);
		for (let y = 1; y < size.y; y++) {
			result.push(x + y * limit);
		}
	}
	return result.sort((a, b) => a - b);
}

/**
 * Вернёт площадь фигуры
 */
export function getFigureSquare(size: SizeXY): number {
	return size.x * size.y;
}
