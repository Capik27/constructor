import { InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setNetSize } from "../../../store/controlsSlice";

export const SizeInput = () => {
	const dispatch = useDispatch();
	const gameStarted = useSelector((state: any) => state.controls.gameStarted);

	const netSizeHandler = (value: any) => {
		dispatch(setNetSize(value));
	};

	return (
		<InputNumber
			min={3}
			max={16}
			defaultValue={3}
			disabled={gameStarted}
			onChange={netSizeHandler}
		/>
	);
};
