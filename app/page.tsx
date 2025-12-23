"use client";

import { useForm } from "@tanstack/react-form";
import {
	ChevronDownIcon,
	DownloadIcon,
	RotateCcwIcon,
	RulerIcon,
	TvMinimalIcon,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useState,
} from "react";
import {
	TransformComponent,
	TransformWrapper,
	useControls,
} from "react-zoom-pan-pinch";
import * as z from "zod";
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import Ruler from "@/components/ruler";
import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Item } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
	distance: z.number().positive("Value must be positive"),
	size: z.number().positive("Value must be positive"),
});

export default function Home() {
	const [rulerActive, setRulerActive] = useState(false);
	const [file, setFile] = useState<File[] | undefined>();
	const [uploadedImgUrl, setUploadedImgUrl] = useState<string | undefined>();
	const [rulerDragging, setRulerDragging] = useState(false);
	const [rulerY, setRulerY] = useState(20);
	const [rulerP1X, setRulerP1X] = useState(10);
	const [rulerP2X, setRulerP2X] = useState(40);
	const [settingRuler, setSettingRuler] = useState(false);
	useEffect(() => {
		if (file !== undefined) {
			setUploadedImgUrl(URL.createObjectURL(file[0]));
		}
	}, [file]);

	const onSetRuler = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setRulerActive(true);
		setRulerP1X(-10);
		setRulerP2X(-10);
		setRulerY(-10);
		setSettingRuler(true);
	};

	const onResetRuler = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setRulerActive(false);
	};

	const beforeSubmit = () => {
		console.log("aaaa");
		if (file === undefined || file.length < 1 || rulerActive === false) {
			return false;
		}
		return true;
	};

	const onSubmit = (value: { distance: number; size: number }) => {
		console.log(rulerP1X);
		console.log("HIIII");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full flex-col items-center justify-normal gap-5 py-16 px-16 bg-white dark:bg-black sm:items-start">
				<div className="flex items-center justify-between w-full">
					<h1 className="text-2xl font-bold">Planet Coaster Map Creator</h1>
					<ThemeSwitcher />
				</div>
				<div className="w-full flex gap-4 flex-row">
					<div className="h-128 max-h-128 flex-1">
						{(() => {
							return uploadedImgUrl === undefined ? (
								<FileDrop file={file} setFile={setFile} />
							) : (
								<TransformWrapper minScale={0.6} disabled={rulerDragging}>
									{({ zoomIn, zoomOut, resetTransform, ..._rest }) => (
										<>
											<Controls />
											<TransformComponent wrapperClass="min-w-full min-h-full max-w-full max-h-full rounded-sm border border-border bg-background">
												<Image
													src={uploadedImgUrl}
													alt="uploaded image"
													fill
													className="relative!"
												/>
												{rulerActive ? (
													<Ruler
														p1x={rulerP1X}
														y={rulerY}
														p2x={rulerP2X}
														setP1X={setRulerP1X}
														setP2X={setRulerP2X}
														setY={setRulerY}
														setDragging={setRulerDragging}
														setting={settingRuler}
														setSetting={setSettingRuler}
													/>
												) : null}
											</TransformComponent>
										</>
									)}
								</TransformWrapper>
							);
						})()}
					</div>
					<Item
						variant="outline"
						className="flex-1 bg-background flex items-start p-4 flex-col"
					>
						<h2 className="text-2xl font-bold">Options</h2>
						<Form
							onSetRuler={onSetRuler}
							onResetRuler={onResetRuler}
							beforeSubmit={beforeSubmit}
							onSubmit={onSubmit}
						/>
					</Item>
				</div>
				<div>
					<p>
						All processing is done locally on your computer. The image you
						upload to the website is not uploaded to the internet.
					</p>
					<p>
						Made with ❤️ by{" "}
						<Link href="https://github.com/leofleeo" className="underline">
							leofleeo
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}

function FileDrop({
	file,
	setFile,
}: {
	file: File[] | undefined;
	setFile: Dispatch<SetStateAction<File[] | undefined>>;
}) {
	function handleDrop(files: File[]) {
		setFile(files);
	}
	return (
		<Dropzone
			maxFiles={1}
			onDrop={handleDrop}
			accept={{ "image/*": [] }}
			onError={console.error}
			className="h-full w-full"
			src={file}
		>
			<DropzoneEmptyState />
			<DropzoneContent />
		</Dropzone>
	);
}

const Controls = () => {
	const { zoomIn, zoomOut, resetTransform } = useControls();

	return (
		<div className="flex gap-4 z-10 absolute m-2 p-2 bg-muted/50 rounded-sm">
			<Button
				size="icon"
				variant="secondary"
				className="border border-border"
				onClick={() => zoomIn()}
				title="Zoom In"
			>
				<ZoomInIcon />
			</Button>
			<Button
				size="icon"
				variant="secondary"
				className="border border-border"
				onClick={() => zoomOut()}
				title="Zoom Out"
			>
				<ZoomOutIcon />
			</Button>
			<Button
				size="icon"
				variant="secondary"
				className="border border-border"
				onClick={() => resetTransform()}
				title="Reset zoom"
			>
				<RotateCcwIcon />
			</Button>
		</div>
	);
};

function Form({
	onSetRuler,
	onResetRuler,
	onSubmit,
	beforeSubmit, //this function will return true if there is not a missing value, if not it will return false
}: {
	onSetRuler: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onResetRuler: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onSubmit: (value: { distance: number; size: number }) => void;
	beforeSubmit: () => boolean;
}) {
	const form = useForm({
		defaultValues: {
			distance: 0,
			size: 0,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			if (!beforeSubmit()) {
				return;
			}
			console.log("boingo");
			setProcessing(true);
			onSubmit(value);
			setTimeout(() => {
				setProcessing(false);
			}, 1000);
		},
	});
	const [processing, setProcessing] = useState(false);
	const [unit, setUnit] = useState("m");
	function preventInvalid(e: React.InputEvent<HTMLInputElement>) {
		const val = e.data;
		if (val && !/^[0-9.]$/.test(val)) {
			e.preventDefault();
		}
	}

	return (
		<form
			className="w-full"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field
					name="distance"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Distance</FieldLabel>
								<InputGroup>
									<InputGroupInput
										aria-invalid={isInvalid}
										type="number"
										value={
											Number.isNaN(field.state.value) ? "" : field.state.value
										}
										onBlur={field.handleBlur}
										inputMode="decimal"
										id={field.name}
										onBeforeInput={(e) => preventInvalid(e)}
										onChange={(e) => field.handleChange(e.target.valueAsNumber)}
									/>
									<InputGroupAddon>
										<RulerIcon />
									</InputGroupAddon>
									<InputGroupAddon align="inline-end">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<InputGroupButton>
													{unit} <ChevronDownIcon />
												</InputGroupButton>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Units</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuRadioGroup
													value={unit}
													onValueChange={setUnit}
												>
													<DropdownMenuRadioItem value="km">
														Kilometers
													</DropdownMenuRadioItem>
													<DropdownMenuRadioItem value="m">
														Meters
													</DropdownMenuRadioItem>
													<DropdownMenuRadioItem value="mi">
														Miles
													</DropdownMenuRadioItem>
													<DropdownMenuRadioItem value="yd">
														Yards
													</DropdownMenuRadioItem>
													<DropdownMenuRadioItem value="ft">
														Feet
													</DropdownMenuRadioItem>
												</DropdownMenuRadioGroup>
											</DropdownMenuContent>
										</DropdownMenu>
									</InputGroupAddon>
								</InputGroup>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
				<Field orientation="horizontal">
					<Button onClick={(e) => onSetRuler(e)}>
						<RulerIcon /> Set map ruler
					</Button>
					<Button onClick={(e) => onResetRuler(e)}>
						<RotateCcwIcon /> Reset ruler
					</Button>
				</Field>
				<form.Field
					name="size"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>
									In game screen size
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										aria-invalid={isInvalid}
										type="number"
										value={
											Number.isNaN(field.state.value) ? "" : field.state.value
										}
										id={field.name}
										onBlur={field.handleBlur}
										onBeforeInput={(e) => preventInvalid(e)}
										onChange={(e) => field.handleChange(e.target.valueAsNumber)}
										inputMode="decimal"
									/>
									<InputGroupAddon>
										<TvMinimalIcon />
									</InputGroupAddon>
									<InputGroupAddon align="inline-end">m</InputGroupAddon>
								</InputGroup>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
				<Field orientation="horizontal">
					<Button>
						{(() => {
							return processing ? <Spinner /> : <DownloadIcon />;
						})()}
						Download
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
