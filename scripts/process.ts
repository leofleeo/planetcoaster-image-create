import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import convert, { type Unit } from "convert";

export async function crop(
	image: File,
	rulerDistPixels: number,
	rulerDistReal: number,
	rulerDistUnit: string,
	gameDispSize: number,
): Promise<Blob | undefined> {
	let rulerDistMeters = rulerDistReal;
	if (rulerDistUnit !== "m") {
		rulerDistMeters = convert(rulerDistReal, rulerDistUnit as Unit).to("meter");
	}
	const singleWidth = (rulerDistPixels / rulerDistMeters) * gameDispSize;
	const singleHeight = (singleWidth / 16) * 9;
	const canvas = new OffscreenCanvas(singleWidth, singleHeight);
	const ctx = canvas.getContext("2d");
	if (ctx === null) {
		console.log("no context for some reason");
		return;
	}
	const imgBmp = await createImageBitmap(image);
	const xTiles = Math.ceil(imgBmp.width / singleWidth);
	const yTiles = Math.ceil(imgBmp.height / singleHeight);
	const zipFileWriter = new BlobWriter();
	const zipWriter = new ZipWriter(zipFileWriter);
	for (let yi = 0; yi < yTiles; yi++) {
		let height = singleHeight;
		if (yi * singleHeight < imgBmp.height) {
			height = imgBmp.height - yi * singleHeight;
		}
		for (let xi = 0; xi < xTiles; xi++) {
			let width = singleWidth;
			if (xi * singleWidth < imgBmp.width) {
				width = imgBmp.width - xi * singleWidth;
			}
			ctx.clearRect(0, 0, singleWidth, singleHeight);
			ctx.drawImage(
				imgBmp,
				xi * singleWidth,
				yi * singleHeight,
				width,
				height,
				0,
				0,
				width,
				height,
			);
			const imgBlob = await canvas.convertToBlob({ type: "image/png" });
			console.log("writey write write");
			const fileName = `column${xi + 1}-row${yi + 1}-map.png`;
			const blobReader = new BlobReader(imgBlob);
			await zipWriter.add(fileName, blobReader);
		}
	}
	console.log("yo I'm waiting for my data");
	await zipWriter.close();
	const data = await zipFileWriter.getData();
	console.log("I got here and I shall return");
	return data;
}
