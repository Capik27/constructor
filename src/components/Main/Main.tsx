import { useDispatch, useSelector } from "react-redux";
import "./index.scss";
import { useState, useEffect } from "react";
import { NetTypes } from "../../types/interfaces";
import { removeBaseItem, replaceBaseItem } from "../../store/dragSlice";

function initNet(size: number = 3) {
	const newNet = new Array(size * size);
	for (let i = 0; i < newNet.length; i++) {
		newNet[i] = { id: i, name: `${i}`, empty: true };
	}
	return newNet;
}

export function Main() {
	const dispatch = useDispatch();
	const { netSize, gameStarted } = useSelector((state: any) => state.controls);
	const [net, setNet] = useState<NetTypes[]>([]);
	const [dropTargets, setDropTargets] = useState<Array<HTMLElement | null>>([]);

	const sizeStyle = {
		gridTemplateColumns: `repeat(${netSize}, 32px)`,
		gridTemplateRows: `repeat(${netSize}, 32px)`,
	};

	useEffect(() => {
		setNet(initNet(netSize));
	}, [gameStarted]);

	/////////////////////////////////////////////////////////
	// DRAG
	/////////////////////////////////////////////////////////

	const current = useSelector((state: any) => state.drag.current);

	const cleanDragTargets = () => {
		for (let i = 0; i < dropTargets.length; i++) {
			dropTargets[i]?.classList.remove("dragover");
			dropTargets[i]?.classList.remove("warning");
		}
		setDropTargets([]);
	};

	// Если елемент влазит в поле
	const checkEdgeX = (id: number, sizeX: number) => {
		const ost = netSize - (id % netSize);
		return ost >= sizeX;
	};
	// Если после елемента нет ничего
	const checkClosest = (id: number, sizeX: number) => {
		if (!net[id].empty) {
			if (net[id].size?.x === sizeX) {
				return true;
			} else {
				return false;
			}
		} else {
			for (let i = 1; i < sizeX; i++) {
				if (!net[id + i].empty) return false;
			}
			return true;
		}
	};
	const checkX = (id: number, sizeX: number) => {
		return checkEdgeX(id, sizeX) && checkClosest(id, sizeX);
	};

	const addClassToTargets = (cname: string, id: number, sizeX: number) => {
		const targets: Array<HTMLElement | null> = [];
		for (let i = 0, el; i < sizeX; i++) {
			el = document.getElementById(String(id + i));
			el?.classList.add(cname);
			targets.push(el);
			if ((id + i + 1) % netSize === 0) break; // находит правую границу сетки
		}
		setDropTargets(targets);
	};
	///////////////////////////////////////////////////////
	const dragHandlerStart = (e: any, item: any) => {
		e.preventDefault();
	};
	const dragHandlerLeave = (e: any) => {
		cleanDragTargets();

		// e.target.classList.remove("warning");
	};

	const dragHandlerOver = (e: any, item: any) => {
		e.preventDefault();
		const sizeX = current.size.x;

		if (checkX(item.id, sizeX)) {
			addClassToTargets("dragover", item.id, sizeX);
		} else {
			addClassToTargets("warning", item.id, sizeX);
			//e.target.classList.add("warning");
		}
	};

	const dragHandlerEnd = (e: any) => {
		e.target.classList.remove("dragover");
		e.target.classList.remove("warning");
	};
	const dragHandlerDrop = (e: any, item: any) => {
		cleanDragTargets();
		e.preventDefault();

		const sizeX = current.size.x;
		if (!checkX(item.id, sizeX)) return;

		setNet((prevNet) => {
			const build = { ...current, id: item.id, empty: false };
			const newNet = [...prevNet];
			newNet[item.id] = build;

			if (current.size.x > 1) {
				for (let i = 1; i < current.size.x; i++) {
					newNet[item.id + i] = {
						...current,
						id: item.id + i,
						empty: false,
						hidden: true,
					};
				}
			}

			console.log("build", build);

			if (item.empty) {
				dispatch(removeBaseItem(current.id));
			} else {
				dispatch(replaceBaseItem({ current, target: item }));
			}
			return newNet;
		});

		console.log("drop2", item, "current", current);
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
											: `main-item-X${item.size.x}`
									}
									onDragStart={(e) => dragHandlerStart(e, item)}
									onDragLeave={(e) => dragHandlerLeave(e)}
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
