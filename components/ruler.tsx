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
	const [currentPoint, setCurrentPoint] = useState(1);

	useEffect(() => {
		if (!setting) {
			svg.current?.classList.remove("cursor-crosshair");
			return;
		}
		svg.current?.classList.add("cursor-crosshair");
	}, [setting]);

	const convertPosToSVGPos = (x: number, y: number): DOMPoint | undefined => {
		if (svg.current == null) {
			return;
		}
		const pt = svg.current.createSVGPoint();
		pt.x = x;
		pt.y = y;
		const adjustedPt = pt.matrixTransform(
			svg.current.getScreenCTM()?.inverse(),
		);
		return adjustedPt;
	};

	const onMove = (e: MouseEvent) => {
		if (e.buttons === 1 && whichDragged !== Points.None) {
			const pt = convertPosToSVGPos(e.clientX, e.clientY);
			if (pt === undefined) {
				return;
			}
			setY(pt.y);
			if (whichDragged === Points.P1) {
				setP1X(pt.x);
			} else {
				setP2X(pt.x);
			}
		}
	};

	const onClick = (e: MouseEvent) => {
		console.log("onclicky");
		if (!setting) {
			return;
		}
		console.log("is setty");
		const pt = convertPosToSVGPos(e.clientX, e.clientY);
		if (pt === undefined) {
			return;
		}
		if (currentPoint === 1) {
			console.log("is 1");
			setP1X(pt.x);
			setP2X(pt.x);
			setY(pt.y);
			setCurrentPoint(2);
		}
		if (currentPoint >= 2) {
			console.log("is 2 or greater");
			setP2X(pt.x);
			setY(pt.y);
			setCurrentPoint(1);
			setSetting(false);
		}
	};
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: a keypress just wouldn't make sense why would I even need this?? people who really need to use keyboard can just rebind a key to their mouse
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="z-5 absolute w-full h-full"
			aria-label="ruler"
			role="img"
			ref={svg}
			onMouseMove={onMove}
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
					className="stroke-black stroke-6"
				/>
				<line
					x1={p1x}
					y1={y}
					x2={p2x}
					y2={y}
					className="stroke-white stroke-2"
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
				<circle r="4" cx={0} cy={0} fill="black" />
				<circle r="2" cx={0} cy={0} fill="white" />
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
				<circle r="4" cx={0} cy={0} fill="black" />
				<circle r="2" cx={0} cy={0} fill="white" />
			</svg>
		</svg>
	);
}
