import { ITargets, IdType, NetTypes, SizeXY } from "../types/interfaces";

export function checkFigureSizes(net: NetTypes[], id: number, size: SizeXY) {
	return net[id].size?.x === size.x && net[id].size?.y === size.y;
}

export function getHiddenBlockParentId(net: NetTypes[], id: number) {
	return net[id]?.hidden ? net[id]?.parentId : net[id]?.id;
}

/**
 * Функция вернёт объект {targets: number[], enable: boolean} / id таргетов и индикатор подсветки
 * @param net массив блоков = всё поле
 * @param item экземпляр взятого блока = объект
 * @param id номер блока
 * @param size объект с полями "x" и "y"
 * @param netSize размер стороны поля(квадрата)
 */
export function getTargetBlocks(
	net: NetTypes[],
	item: NetTypes,
	id: number,
	netSize: number
): ITargets {
	const size = item.size;
	const TARGETS_BASE: IdType[] = item.targets.map(
		(targetId: IdType) => id + targetId!
	);
	const RESULT_TRUE: ITargets = { targets: TARGETS_BASE, enable: true };
	const RESULT_FALSE: ITargets = { targets: TARGETS_BASE, enable: false };

	//Если слот ЗАНЯТ ИЛИ СКРЫТ = навели на фигуру в поле
	if (!net[id]?.empty || net[id]?.hidden) {
		//Если размеры совпадают
		if (checkFigureSizes(net, id, size)) {
			//Добавляем только id родительского блока
			return { targets: [getHiddenBlockParentId(net, id)], enable: true };
		} else {
			//Добавляем все таргеты из фигуры которую держим со смещением от блока над которым держим её
			return RESULT_FALSE;
		}
	} else {
		//Если слот СВОБОДЕН = навели на пустой слот
		//Проверка ближайших слотов под размер фигуры
		const step = netSize;
		for (let i = 0; i < size.x; i++) {
			if (!net[id + i]?.empty) return RESULT_FALSE;
			for (let j = 1; j < size.y; j++) {
				if (!net[id + i + j * step]?.empty) return RESULT_FALSE;
			}
		}
		//Если преград другими фигурами нет, то запускаем функцию проверки границ поля
		// checkNetEdge(netSize, id, size);

		const fieldSize = netSize * netSize;
		let FilteredBase: IdType[] = [];
		// получаем остаток блоков в ряду / проверка на пересечение правой границы поля: remX >= size.x;
		const remX = netSize - (id % netSize);
		// получаем нижний блок фигуры в колонке / проверка на пересечение нижней границы поля: remY <= fieldSize;
		const remY = id + size.y * netSize - netSize;

		if (remX >= size.x && remY <= fieldSize) {
			// Если по х и у всё влазит
			return RESULT_TRUE;
		} else if (remX < size.x && remY > fieldSize) {
			// Если по х и у всё не влазит
			FilteredBase = TARGETS_BASE.filter(
				(id: IdType) =>
					!(
						netSize - (id! % netSize) < size.x ||
						id! + size.y * netSize - netSize > fieldSize
					)
			);
		} else if (remX < size.x) {
			// Если остаток фри блоков меньше размера фигуры по х
			FilteredBase = TARGETS_BASE.filter(
				(id: IdType) => !(netSize - (id! % netSize) < size.x)
			);
		} else if (remY > fieldSize) {
			// Если id нижнего блока фигуры вне диапазона поля (нижняя граница у)
			FilteredBase = TARGETS_BASE.filter(
				(id: IdType) => !(id! + size.y * netSize - netSize > fieldSize)
			);
		}
		return { targets: FilteredBase, enable: false };
	}
}

/**
 * Функция вернёт объект {targets: number[], enable: boolean} / id таргетов и индикатор подсветки
 * @param option опция проверки: тру = выдаст совпадающие id, фолс = не, которыми отличаются
 */
export function getCrossBlocks(
	a: IdType[],
	b: IdType[],
	option: boolean = false
): IdType[] {
	const result: IdType[] = [];
	const max = Math.max(a.length, b.length);
	for (let i = 0; i < max; i++) {
		if (a[i] && b.includes(a[i]) === option) result.push(a[i]);
		// if (b[i] && a.includes(b[i]) === option) result.push(b[i]);
	}
	return result;
}
