"use client";

import { ChevronDownIcon, RulerIcon, TvMinimalIcon } from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import ThemeSwitcher from "@/components/theme-switcher";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Item } from "@/components/ui/item";

export default function Home() {
	const [file, setFile] = useState<File[] | undefined>();
	const [unit, setUnit] = useState("km");
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
						<form className="w-full">
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="distance">Distance</FieldLabel>
									<InputGroup>
										<InputGroupInput
											type="number"
											id="distance"
											placeholder="20"
											min={0}
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
								</Field>
								<Field>
									<FieldLabel htmlFor="size">In game screen size</FieldLabel>
									<InputGroup>
										<InputGroupInput type="number" id="size" placeholder="8" />
										<InputGroupAddon>
											<TvMinimalIcon />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">m</InputGroupAddon>
									</InputGroup>
								</Field>
							</FieldGroup>
						</form>
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
