import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { useState, useEffect } from "react";
import { NetTypes, SizeXY } from "../../types/interfaces";
import { removeBaseItem, replaceBaseItem } from "../../store/dragSlice";

function initNet(size: number = 3) {
	const newNet = new Array(size * size);
	for (let i = 0; i < newNet.length; i++) {
		newNet[i] = {
			id: i,
			name: `${i}`,
			empty: true,
			hidden: false,
			size: { x: 1, y: 1 },
			parentId: null,
		};
	}
	return newNet;
}

export function Main() {
	const dispatch = useDispatch();
	const { netSize, gameStarted } = useSelector((state: any) => state.controls);
	const [net, setNet] = useState<NetTypes[]>([]);

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

	const current = useSelector((state: any) => state.drag.current);

	const checkEdge = (id: number, size: SizeXY) => {
		const ostX = netSize - (id % netSize);
		for (let i = 0; i < size.x; i++) {
			const ostY = id + i + size.y * netSize - netSize <= netSize * netSize;
			if (!ostY) return false;
		}
		return ostX >= size.x;
	};

	const checkClosest = (id: number, size: SizeXY) => {
		if (!net[id]?.empty && !net[id]?.hidden) {
			if (net[id].size?.x === size.x && net[id].size?.y === size.y) {
				return true;
			} else {
				return false;
			}
		} else {
			const step = netSize;
			for (let i = 0; i < size.x; i++) {
				if (!net[id + i]?.empty) return false;
				if (size.y > 1) {
					for (let j = 1; j < size.y; j++) {
						if (!net[id + i + j * step]?.empty) return false;
					}
				}
			}
			return true;
		}
	};

	const checkXY = (id: number, size: SizeXY) => {
		// console.log(id, "checkXY");
		return checkEdge(id, size) && checkClosest(id, size);
	};

	const getHiddenParentId = (id: number) => {
		// if (net[id]?.hidden) {
		// 	console.log(id, "hidden");
		// } else {
		// 	console.log(id, "NOT");
		// }
		return net[id]?.hidden ? net[id]?.parentId : net[id]?.id;
	};

	/////////////////////////////////////////////////////////
	// CLASSES
	/////////////////////////////////////////////////////////

	const addClassToTargets = (cname: string, id: number, size: SizeXY) => {
		for (let i = 0, el; i < size.x; i++) {
			let currentId_X = getHiddenParentId(id + i);
			el = document.getElementById(String(currentId_X));
			el?.classList.add(cname);
			if (size.y > 1) {
				const step = netSize;
				for (let j = 1; j < size.y; j++) {
					let y_id = id + i + j * step;
					let currentId_Y = getHiddenParentId(y_id);
					el = document.getElementById(String(currentId_Y));
					el?.classList.add(cname);
					if (id + i + j * netSize - netSize > netSize * netSize) break; // находит нижнюю границу сетки
				}
			}
			if ((id + i + 1) % netSize === 0) break;
		}
	};

	const removeClassFromTargets = (id: number, size: SizeXY) => {
		for (let i = 0, el; i < size.x; i++) {
			el = document.getElementById(String(getHiddenParentId(id + i)));
			el?.classList.remove("dragover");
			el?.classList.remove("warning");

			if (size.y > 1) {
				const step = netSize;
				for (let j = 1, y_id; j < size.y; j++) {
					y_id = id + i + j * step;
					el = document.getElementById(String(getHiddenParentId(y_id)));
					el?.classList.remove("dragover");
					el?.classList.remove("warning");
				}
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

			for (let i = 0; i < current.size.x; i++) {
				newNet[item.id + i] = {
					...current,
					id: item.id + i,
					empty: false,
					hidden: i != 0, // родительский элемент не скрыт
					parentId: item.id,
				};
				for (let j = 1; j < current.size.y; j++) {
					newNet[item.id + i + j * netSize] = {
						...current,
						id: item.id + i + j * netSize,
						empty: false,
						hidden: true,
						parentId: item.id,
					};
				}
			}

			// Проверка на пустоту элемента в который идет дроп
			if (item.empty) {
				dispatch(removeBaseItem(current.id));
			} else {
				dispatch(replaceBaseItem({ current, target: item }));

				// const swapClass = "swap";
				// let el1 = document.getElementById(String(current.id));
				// let el2 = document.getElementById(String(item.id));
				// el1?.classList.add(swapClass);
				// el2?.classList.add(swapClass);
				// const timer = setTimeout(() => {
				// 	el1?.classList.remove(swapClass);
				// 	el2?.classList.remove(swapClass);
				// 	clearTimeout(timer);
				// }, 1000);
			}
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
