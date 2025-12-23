import type { Dispatch, SetStateAction } from "react";

export default function Ruler({
	p1x,
	p2x,
	y,
	setDragging,
	setP1X,
	setP2X,
	setY
}: {
	p1x: number;
	p2x: number;
	y: number;
	setP1X: Dispatch<SetStateAction<number>>
	setP2X: Dispatch<SetStateAction<number>>
	setY: Dispatch<SetStateAction<number>>
	setDragging: Dispatch<SetStateAction<boolean>>
}) {
	const startDragging =  () => {
		setDragging(true);
	}
	const stopDragging = () => {
		setDragging(false);
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="z-5 absolute w-full h-full"
			aria-label="ruler"
			role="img"
		>
			<svg role="img" aria-label="line" className="z-6">
				<line
					x1={p1x}
					y1={y}
					x2={p2x}
					y2={y}
					className="stroke-black stroke-10"
				/>
				<line
					x1={p1x}
					y1={y}
					x2={p2x}
					y2={y}
					className="stroke-white stroke-4"
				/>
			</svg>
			<svg role="img" aria-label="point1" className="z-8 cursor-move" onMouseDown={startDragging} onMouseUp={stopDragging}>
				<circle r="8" cx={p1x} cy={y} fill="black" />
				<circle r="4" cx={p1x} cy={y} fill="white" />
			</svg>
			<svg role="img" aria-label="point2" className="z-7 cursor-move"onMouseDown={startDragging} onMouseUp={stopDragging}>
				<circle r="8" cx={p2x} cy={y} fill="black" />
				<circle r="4" cx={p2x} cy={y} fill="white" />
			</svg>
		</svg>
	);
}
