import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { useState, useEffect } from "react";
import { NetTypes, SizeXY } from "../../types/interfaces";
import {
	removeBaseItem,
	replaceBaseItem,
	setCurrentDrag,
} from "../../store/dragSlice";
import initNet from "../../models/initNet";
// import { getCrossBlocks, getTargetBlocks } from "../../models/NetMethods";
// import deepEqual from "deep-equal";

export function Main() {
	const dispatch = useDispatch();
	const { netSize, gameStarted } = useSelector((state: any) => state.controls);
	const [net, setNet] = useState<NetTypes[]>([]);
	const current = useSelector((state: any) => state.drag.current);

	const sizeStyle = {
		gridTemplateColumns: `repeat(${netSize}, 32px)`,
		gridTemplateRows: `repeat(${netSize}, 32px)`,
	};

	useEffect(() => {
		setNet(initNet(netSize));
	}, [gameStarted]);

	/////////////////////////////////////////////////////////
	// CHECKS
	/////////////////////////////////////////////////////////

	const checkEdge = (id: number, size: SizeXY) => {
		const fieldSize = netSize * netSize;
		const remX = netSize - (id % netSize); // остаток блоков в ряду
		const remY = id + (size.x - 1) + size.y * netSize - netSize; // номер нижнего правого (последнего) блока фигуры
		return remX >= size.x && remY <= fieldSize;
	};

	const checkSizes = (id: number, size: SizeXY) => {
		return net[id].size?.x === size.x && net[id].size?.y === size.y;
	};

	const checkXY = (id: number, size: SizeXY) => {
		//Если слот ЗАНЯТ ИЛИ СКРЫТ = навели на фигуру в поле
		if (!net[id]?.empty || net[id]?.hidden) {
			//Если размеры совпадают
			if (checkSizes(id, size)) {
				return true;
			} else {
				return false;
			}
		} else {
			//Если слот СВОБОДЕН = навели на пустой слот
			//Проверка ближайших слотов под размер фигуры
			const step = netSize;
			for (let i = 0; i < size.x; i++) {
				if (!net[id + i]?.empty) return false;

				for (let j = 1; j < size.y; j++) {
					if (!net[id + i + j * step]?.empty) return false;
				}
			}
			//Если преград другими фигурами нет, то запускаем функцию проверки границ поля
			return checkEdge(id, size);
		}
	};

	const getHiddenParentId = (id: number) => {
		return net[id]?.hidden ? net[id]?.parentId : net[id]?.id;
	};

	/////////////////////////////////////////////////////////
	// CLASSES
	/////////////////////////////////////////////////////////

	const addClassToTargets = (cname: string, id: number, size: SizeXY) => {
		if (checkSizes(id, size)) {
			document
				.getElementById(String(net[id].parentId))
				?.classList.add("dragover");
			return;
		}
		for (let i = 0, el; i < size.x; i++) {
			let currentId_X = getHiddenParentId(id + i);
			el = document.getElementById(String(currentId_X));
			el?.classList.add(cname);

			const step = netSize;
			for (let j = 1; j < size.y; j++) {
				let y_id = id + i + j * step;
				let currentId_Y = getHiddenParentId(y_id);
				el = document.getElementById(String(currentId_Y));
				el?.classList.add(cname);
				if (id + i + j * netSize - netSize > netSize * netSize) break; // находит нижнюю границу сетки
			}

			if ((id + i + 1) % netSize === 0) break;
		}
	};

	const removeClassFromTargets = (id: number, size: SizeXY) => {
		if (checkSizes(id, size)) {
			document
				.getElementById(String(net[id].parentId))
				?.classList.remove("dragover");
			return;
		}
		for (let i = 0, el; i < size.x; i++) {
			el = document.getElementById(String(getHiddenParentId(id + i)));
			el?.classList.remove("dragover");
			el?.classList.remove("warning");

			const step = netSize;
			for (let j = 1, y_id; j < size.y; j++) {
				y_id = id + i + j * step;
				el = document.getElementById(String(getHiddenParentId(y_id)));
				el?.classList.remove("dragover");
				el?.classList.remove("warning");
			}
		}
	};

	/////////////////////////////////////////////////////////
	// DRAG
	/////////////////////////////////////////////////////////

	const dragHandlerStart = (e: any, item: any) => {
		e.preventDefault();
	};
	const dragHandlerLeave = (e: any, item: any) => {
		removeClassFromTargets(item.id, current.size);
	};

	const dragHandlerOver = (e: any, item: any) => {
		e.preventDefault();
		let itemID = item.id;

		if (checkXY(item.id, current.size)) {
			addClassToTargets("dragover", itemID, current.size);
		} else {
			addClassToTargets("warning", itemID, current.size);
		}
	};

	const dragHandlerEnd = (e: any) => {
		e.target.classList.remove("dragover");
		e.target.classList.remove("warning");
	};

	const dragHandlerDrop = (e: any, item: any) => {
		e.preventDefault();

		removeClassFromTargets(item.id, current.size);
		if (!checkXY(item.id, current.size)) return;

		setNet((prevNet) => {
			const newNet = [...prevNet];

			const genNewNet = (id: number) => {
				for (let i = 0; i < current.size.x; i++) {
					newNet[id + i] = {
						...current,
						id: id + i,
						empty: false,
						hidden: i != 0, // родительский элемент не скрыт
						parentId: id,
					};
					for (let j = 1; j < current.size.y; j++) {
						newNet[id + i + j * netSize] = {
							...current,
							id: id + i + j * netSize,
							empty: false,
							hidden: true,
							parentId: id,
						};
					}
				}
			};

			// Если дошли до сюда, то наша фигура полностью помещается на площадке,
			// либо мы указателем в фигуре на поле.
			//
			// Проверка на пустоту элемента в который идет дроп
			if (net[item.parentId].empty) {
				genNewNet(item.id);
				dispatch(removeBaseItem(current.id));
			} else {
				genNewNet(item.parentId);
				dispatch(replaceBaseItem({ current, target: item }));
			}
			dispatch(setCurrentDrag(null));
			return newNet;
		});
	};

	return (
		<>
			<main className="main">
				<div className="main-body" style={sizeStyle}>
					{gameStarted &&
						net.map((item) => {
							return (
								<div
									id={`${item.id}`}
									key={item.id}
									className={
										item.empty
											? "main-item-empty"
											: item.hidden
											? "main-item-hidden"
											: `main-item-X${item.size.x} main-item-Y${item.size.y}`
									}
									onDragStart={(e) => dragHandlerStart(e, item)}
									onDragLeave={(e) => dragHandlerLeave(e, item)}
									onDragOver={(e) => dragHandlerOver(e, item)}
									onDragEnd={(e) => dragHandlerEnd(e)}
									onDrop={(e) => dragHandlerDrop(e, item)}
									draggable={item.empty}
								>
									{item.name}
								</div>
							);
						})}
				</div>
			</main>
		</>
	);
}
