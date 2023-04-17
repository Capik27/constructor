import { MIN_NET_SIZE } from "../utils/constants";

export default function initNet(size: number = MIN_NET_SIZE) {
	const newNet = new Array(size * size);
	for (let i = 0; i < newNet.length; i++) {
		newNet[i] = {
			id: i,
			name: `${i}`,
			empty: true,
			hidden: false,
			size: { x: 1, y: 1 },
			parentId: i,
		};
	}
	return newNet;
}
