import "./index.scss";
import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setGameStarted } from "../../store/controlsSlice";
import {
	setCurrentDrag,
	setBoard,
	resetCurrent,
	swapBaseItems,
	generateBase,
} from "../../store/dragSlice";
import { SizeInput } from "./SizeInput/SizeInput";
import { NetTypes } from "../../types/interfaces";

export function Sidebar() {
	const dispatch = useDispatch();
	const { netSize, gameStarted } = useSelector((state: any) => state.controls);
	const current = useSelector((state: any) => state.drag.current);
	const elems: NetTypes[] = useSelector((state: any) => state.drag.base);

	const switchHandler = (value: boolean) => {
		//value && dispatch(resetBase());
		value && dispatch(generateBase(netSize));
		dispatch(setGameStarted(value));
	};

	/////////////////////////////////////////////////////////
	// DRAG
	/////////////////////////////////////////////////////////

	const dragHandlerStart = (e: any, item: any) => {
		dispatch(setCurrentDrag(item));
		dispatch(setBoard("side"));
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
	};
	const dragHandlerDrop = (e: any, item: any) => {
		e.target.classList.remove("dragover");
		e.preventDefault();

		dispatch(swapBaseItems({ current, target: item }));
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
								className={`sidebar-item-X${item.size.x} sidebar-item-Y${item.size.y}`}
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
