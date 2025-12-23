import {
	type Dispatch,
	type MouseEvent,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

export default function Ruler({
	p1x,
	p2x,
	y,
	setDragging,
	setP1X,
	setP2X,
	setY,
	setting,
	setSetting,
}: {
	p1x: number;
	p2x: number;
	y: number;
	setP1X: Dispatch<SetStateAction<number>>;
	setP2X: Dispatch<SetStateAction<number>>;
	setY: Dispatch<SetStateAction<number>>;
	setDragging: Dispatch<SetStateAction<boolean>>;
	setting: boolean;
	setSetting: Dispatch<SetStateAction<boolean>>;
}) {
	const svg = useRef<SVGSVGElement>(null);
	enum Points {
		None = 0,
		P1,
		P2,
	}
	const [whichDragged, setWhichDragged] = useState(Points.None);

	let currentPoint = 0;

	useEffect(() => {
		if (!setting) {
			svg.current?.classList.remove("cursor-crosshair")
			return
		}
		svg.current?.classList.add("cursor-crosshair");
	}, [setting])

	const onMove = (e: MouseEvent) => {
		if (
			e.buttons === 1 &&
			svg.current !== null &&
			whichDragged !== Points.None
		) {
			const pt = svg.current.createSVGPoint();
			pt.x = e.clientX;
			pt.y = e.clientY;
			const adjustedPt = pt.matrixTransform(
				svg.current.getScreenCTM()?.inverse(),
			);
			setY(adjustedPt.y);
			if (whichDragged === Points.P1) {
				setP1X(adjustedPt.x);
			} else {
				setP2X(adjustedPt.x);
			}
		}
	};

	const onClick = () => {
		if(!setting) {
			return
		}
		currentPoint++;
		if(currentPoint >= 2) {
			currentPoint = 0;
			setSetting(false);
		}
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="z-5 absolute w-full h-full"
			aria-label="ruler"
			role="img"
			ref={svg}
			onMouseMove={(e) => onMove(e)}
			onMouseUp={() => {
				setDragging(false);
				setWhichDragged(Points.None);
			}}
			onClick={onClick}
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
			<svg
				role="img"
				aria-label="point1"
				className="z-8 cursor-move"
				x={p1x - 8}
				y={y - 8}
				viewBox="-8 -8 16 16"
				width={16}
				height={16}
				onMouseDown={() => {
					setDragging(true);
					setWhichDragged(Points.P1);
				}}
			>
				<circle r="8" cx={0} cy={0} fill="black" />
				<circle r="4" cx={0} cy={0} fill="white" />
			</svg>
			<svg
				role="img"
				aria-label="point2"
				className="z-7 cursor-move"
				x={p2x - 8}
				y={y - 8}
				viewBox="-8 -8 16 16"
				width={16}
				height={16}
				onMouseDown={() => {
					setDragging(true);
					setWhichDragged(Points.P2);
				}}
			>
				<circle r="8" cx={0} cy={0} fill="black" />
				<circle r="4" cx={0} cy={0} fill="white" />
			</svg>
		</svg>
	);
}
