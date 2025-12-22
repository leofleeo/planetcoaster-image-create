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
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
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
	const [file, setFile] = useState<File[] | undefined>();
	const [uploadedImgUrl, setUploadedImgUrl] = useState<string | undefined>();
	useEffect(() => {
		console.log("useeffect activate");
		if (file !== undefined) {
			setUploadedImgUrl(URL.createObjectURL(file[0]));
		}
	}, [file]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			{
				// Eruda for developer tools on devices with devtools restricted
				//<script src="https://cdnjs.cloudflare.com/ajax/libs/eruda/3.4.3/eruda.min.js"></script>
				//<script>eruda.init();</script>
			}
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
								<Item
									variant="outline"
									className="bg-background flex justify-start items-start max-h-full max-w-full h-full w-full"
								>
									<TransformWrapper minScale={0.6}>
										{({ zoomIn, zoomOut, resetTransform, ..._rest }) => (
											<>
												<Controls />
												<TransformComponent wrapperClass="min-w-full min-h-full max-w-full max-h-full rounded-sm">
													<Image
														src={uploadedImgUrl}
														alt="uploaded image"
														fill
														className="relative!"
													/>
												</TransformComponent>
											</>
										)}
									</TransformWrapper>
								</Item>
							);
						})()}
					</div>
					<Item
						variant="outline"
						className="flex-1 bg-background flex items-start p-4 flex-col"
					>
						<h2 className="text-2xl font-bold">Options</h2>
						<Form file={file} />
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
		<div className="flex gap-4 z-10 absolute m-2 p-2 bg-muted/30 rounded-sm">
			<Button
				size="icon"
				variant="secondary"
				onClick={() => zoomIn()}
				title="Zoom In"
			>
				<ZoomInIcon />
			</Button>
			<Button
				size="icon"
				variant="secondary"
				onClick={() => zoomOut()}
				title="Zoom Out"
			>
				<ZoomOutIcon />
			</Button>
			<Button
				size="icon"
				variant="secondary"
				onClick={() => resetTransform()}
				title="Reset zoom"
			>
				<RotateCcwIcon />
			</Button>
		</div>
	);
};

function Form({ file }: { file: File[] | undefined }) {
	const form = useForm({
		defaultValues: {
			distance: 0,
			size: 0,
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			if (file === undefined) {
				return;
			}
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

	function onSetRuler(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
	}

	function onResetRuler(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
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
