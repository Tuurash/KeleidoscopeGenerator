import { drawRectangle, generateRectanglePattern } from './rectangle.js';
import { drawTriangle, generateTrianglePattern } from './triangle.js';

document.addEventListener("DOMContentLoaded", () => {
	const fileInput = document.getElementById('fileInput') as HTMLInputElement;
	const imageCanvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
	const patternCanvas = document.getElementById('patternCanvas') as HTMLCanvasElement;
	const imageCtx = imageCanvas.getContext('2d');
	const patternCtx = patternCanvas.getContext('2d');
	const rotateLeftBtn = document.getElementById('rotateLeft') as HTMLButtonElement;
	const rotateRightBtn = document.getElementById('rotateRight') as HTMLButtonElement;
	const flipHorizontalBtn = document.getElementById('flipHorizontal') as HTMLButtonElement;
	const flipVerticalBtn = document.getElementById('flipVertical') as HTMLButtonElement;
	const rectangleButton = document.getElementById('rectangleButton') as HTMLButtonElement;
	const triangleButton = document.getElementById('triangleButton') as HTMLButtonElement;
	const rectWidthRange = document.getElementById('rectWidth') as HTMLInputElement;
	const rectHeightRange = document.getElementById('rectHeight') as HTMLInputElement;
	const triangleHypotenuseRange = document.getElementById('triangleHypotenuse') as HTMLInputElement;

	let img: HTMLImageElement;
	let zoomLevel = 1;
	let rotation = 0;
	let shape = 'rectangle';
	let sx = 0, sy = 0;
	let isUpdating = true;
	let flipHorizontal = false;
	let flipVertical = false;
	let rectWidth = parseInt(rectWidthRange.value);
	let rectHeight = parseInt(rectHeightRange.value);
	let triangleHypotenuse = parseInt(triangleHypotenuseRange.value);

	fileInput.addEventListener('change', (event) => {
		const file = (event.target as HTMLInputElement).files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				img = new Image();
				img.onload = () => {
					imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
					imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
				};
				img.src = e.target.result as string;
			};
			reader.readAsDataURL(file);
		}
	});

	imageCanvas.addEventListener('mousemove', (event) => {
		if (img && isUpdating) {
			const rect = imageCanvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			if (shape === 'rectangle') {
				sx = Math.max(0, Math.min(img.width - rectWidth, (x / imageCanvas.width) * img.width));
				sy = Math.max(0, Math.min(img.height - rectHeight, (y / imageCanvas.height) * img.height));
				drawRectangle(imageCtx, img, sx, sy, rectWidth, rectHeight, imageCanvas);
			} else if (shape === 'triangle') {
				const tw = triangleHypotenuse;
				const th = triangleHypotenuse;
				sx = Math.max(0, Math.min(img.width - tw, (x / imageCanvas.width) * img.width));
				sy = Math.max(0, Math.min(img.height - th, (y / imageCanvas.height) * img.height));
				drawTriangle(imageCtx, img, sx, sy, tw, th, imageCanvas);
			}

			generatePattern();
		}
	});

	function generatePattern() {
		if (shape === 'rectangle') {
			generateRectanglePattern(img, sx, sy, rectWidth, rectHeight, zoomLevel, rotation, patternCanvas, patternCtx, flipHorizontal, flipVertical);
		} else if (shape === 'triangle') {
			const tw = triangleHypotenuse;
			const th = triangleHypotenuse;
			generateTrianglePattern(img, sx, sy, tw, th, zoomLevel, rotation, patternCanvas, patternCtx, flipHorizontal, flipVertical);
		}
	}

	rectWidthRange.addEventListener('input', (event) => {
		rectWidth = parseInt((event.target as HTMLInputElement).value);
		if (img && shape === 'rectangle') {
			drawRectangle(imageCtx, img, sx, sy, rectWidth, rectHeight, imageCanvas);
			generatePattern();
		}
	});

	rectHeightRange.addEventListener('input', (event) => {
		rectHeight = parseInt((event.target as HTMLInputElement).value);
		if (img && shape === 'rectangle') {
			drawRectangle(imageCtx, img, sx, sy, rectWidth, rectHeight, imageCanvas);
			generatePattern();
		}
	});

	triangleHypotenuseRange.addEventListener('input', (event) => {
		triangleHypotenuse = parseInt((event.target as HTMLInputElement).value);
		if (img && shape === 'triangle') {
			const tw = triangleHypotenuse;
			const th = triangleHypotenuse;
			drawTriangle(imageCtx, img, sx, sy, tw, th, imageCanvas);
			generatePattern();
		}
	});

	patternCanvas.addEventListener('wheel', (event) => {
		event.preventDefault();
		if (event.deltaY < 0) {
			zoomLevel *= 1.1;
		} else {
			zoomLevel /= 1.1;
		}
		generatePattern();
	});

	rotateLeftBtn.addEventListener('click', () => {
		rotation -= 90;
		generatePattern();
	});

	rotateRightBtn.addEventListener('click', () => {
		rotation += 90;
		generatePattern();
	});

	flipHorizontalBtn.addEventListener('click', () => {
		flipHorizontal = !flipHorizontal;
		generatePattern();
	});

	flipVerticalBtn.addEventListener('click', () => {
		flipVertical = !flipVertical;
		generatePattern();
	});

	rectangleButton.addEventListener('click', () => {
		shape = 'rectangle';
		if (img) {
			generatePattern();
		}
	});

	triangleButton.addEventListener('click', () => {
		shape = 'triangle';
		if (img) {
			generatePattern();
		}
	});

	imageCanvas.addEventListener('contextmenu', (event) => {
		event.preventDefault();
		isUpdating = false;
	});

	imageCanvas.addEventListener('click', () => {
		isUpdating = true;
	});
});