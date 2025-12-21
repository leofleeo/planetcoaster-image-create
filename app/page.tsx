"use client";

import { useForm } from "@tanstack/react-form";
import {
	ChevronDownIcon,
	DownloadIcon,
	Ruler,
	RulerIcon,
	TvMinimalIcon,
} from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import * as z from "zod";
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
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
	distance: z.number().nonnegative("Value cannot be negative"),
	size: z.number().nonnegative("Value cannot be negative"),
});

export default function Home() {
	const [file, setFile] = useState<File[] | undefined>();
	const canvas = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		if (file === undefined || canvas === null) {
			return;
		}
		const ctx = canvas.current?.getContext("2d");
		if (ctx !== undefined && ctx !== null) {
			Promise.all([createImageBitmap(file[0])]).then((img) => {
				const containerWidth =
					ctx.canvas.parentElement?.clientWidth || ctx.canvas.clientWidth;
				const containerHeight =
					ctx.canvas.parentElement?.clientHeight || ctx.canvas.clientHeight;
				const wRatio = containerWidth / img[0].width;
				const hRatio = containerHeight / img[0].height;
				const ratio = Math.min(wRatio, hRatio);
				console.log(ratio);
				console.log(wRatio);
				console.log(hRatio);
				ctx.canvas.width = img[0].width * ratio;
				ctx.canvas.height = img[0].height * ratio;
				ctx.drawImage(img[0], 0, 0, ctx.canvas.width, ctx.canvas.height);
			});
		}
	}, [file]);
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
							return file == null ? (
								<FileDrop file={file} setFile={setFile} />
							) : (
								<Item
									variant="outline"
									className="bg-background flex justify-center items-center max-h-full max-w-full h-full w-full"
								>
									<canvas
										ref={canvas}
										className="rounded-sm max-h-full max-w-full"
									/>
								</Item>
							);
						})()}
					</div>
					<Item
						variant="outline"
						className="flex-1 bg-background flex items-start p-4 flex-col"
					>
						<h2 className="text-2xl font-bold">Options</h2>
						<Form />
					</Item>
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

function Form() {
	const form = useForm({
		defaultValues: {
			distance: 0,
			size: 0,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setProcessing(true);
		},
	});
	const [processing, setProcessing] = useState(false);
	const [unit, setUnit] = useState("km");
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
					<Button>
						<Ruler /> Set map ruler
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
