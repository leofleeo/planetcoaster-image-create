"use client";

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
import { Item } from "@/components/ui/item";

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
				ctx.canvas.width = img[0].width;
				ctx.canvas.height = img[0].height;
				ctx.drawImage(img[0], 0, 0);
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
				<div className="h-128 w-1/2 max-h-128">
					{(() => {
						return file == null ? (
							<FileDrop file={file} setFile={setFile} />
						) : (
							<Item
								variant="outline"
								className="bg-muted/30 flex justify-center items-center max-h-full max-w-full h-full"
							>
								<canvas
									ref={canvas}
									className="rounded-sm max-h-full max-w-full"
								/>
							</Item>
						);
					})()}
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
