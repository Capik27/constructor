import "./index.scss";
import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setGameStarted } from "../../store/controlsSlice";
import {
	setCurrentDrag,
	setBoard,
	resetCurrent,
	resetBase,
	swapBaseItems,
} from "../../store/dragSlice";
import { SizeInput } from "./SizeInput/SizeInput";
import { NetTypes } from "../../types/interfaces";

export function Sidebar() {
	const dispatch = useDispatch();
	const gameStarted = useSelector((state: any) => state.controls.gameStarted);
	const current = useSelector((state: any) => state.drag.current);
	const elems: NetTypes[] = useSelector((state: any) => state.drag.base);

	const switchHandler = (value: boolean) => {
		value && dispatch(resetBase());
		dispatch(setGameStarted(value));
	};

	//.sort(sortId)
	function sortId(a: NetTypes, b: NetTypes) {
		return a.id - b.id;
	}

	console.log("elems", elems);
	/////////////////////////////////////////////////////////
	// DRAG
	/////////////////////////////////////////////////////////

	const dragHandlerStart = (e: any, item: any) => {
		dispatch(setCurrentDrag(item));
		dispatch(setBoard("side"));
		// console.log("start", item);
	};
	const dragHandlerLeave = (e: any) => {
		e.target.classList.remove("dragover");
	};
	const dragHandlerOver = (e: any) => {
		e.target.classList.add("dragover");
		e.preventDefault();
	};
	const dragHandlerEnd = (e: any, item: any) => {
		e.target.classList.remove("dragover");
		dispatch(resetCurrent());
		console.log("end", item);
	};
	const dragHandlerDrop = (e: any, item: any) => {
		e.target.classList.remove("dragover");
		e.preventDefault();

		dispatch(swapBaseItems({ current, target: item }));
		// console.log("drop", item);
	};

	return (
		<section className="sidebar">
			<div className="sidebar-controls">
				<SizeInput />
				<Switch onChange={switchHandler} />
			</div>
			<div className="sidebar-inner">
				{gameStarted &&
					elems.map((item) => {
						return (
							<div
								key={item.id}
								className={`sidebar-item-X${item.size.x}`}
								onDragStart={(e) => dragHandlerStart(e, item)}
								onDragLeave={(e) => dragHandlerLeave(e)}
								onDragOver={(e) => dragHandlerOver(e)}
								onDragEnd={(e) => dragHandlerEnd(e, item)}
								onDrop={(e) => dragHandlerDrop(e, item)}
								draggable={item.empty}
							>
								{item.name}
							</div>
						);
					})}
			</div>
		</section>
	);
}
