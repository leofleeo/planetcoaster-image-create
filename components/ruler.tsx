export default function Ruler({
	p1x,
	p2x,
	y,
}: {
	p1x: number;
	p2x: number;
	y: number;
}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="z-5 absolute w-full h-full"
			aria-label="ruler"
			role="img"
		>
			<line
				x1={p1x}
				y1={y}
				x2={p2x}
				y2={y}
				className="stroke-black stroke-12"
			/>
			<line x1={p1x} y1={y} x2={p2x} y2={y} className="stroke-white stroke-4" />
			<svg role="img" aria-label="point1">
				<circle r="10" cx={p1x} cy={y} fill="black" />
				<circle r="10" cx={p2x} cy={y} fill="black" />
			</svg>
			<circle r="5" cx={p1x} cy={y} fill="white" />
			<circle r="5" cx={p2x} cy={y} fill="white" />
		</svg>
	);
}
