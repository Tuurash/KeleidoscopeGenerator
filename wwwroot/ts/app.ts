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
	const rectangleButton = document.getElementById('rectangleButton') as HTMLButtonElement;
	const triangleButton = document.getElementById('triangleButton') as HTMLButtonElement;

	let img: HTMLImageElement;
	let zoomLevel = 1;
	let rotation = 0;
	let shape = 'rectangle';
	let sx = 0, sy = 0, sw = 90, sh = 128;
	let isUpdating = true;

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
				sx = Math.max(0, Math.min(img.width - sw, (x / imageCanvas.width) * img.width));
				sy = Math.max(0, Math.min(img.height - sh, (y / imageCanvas.height) * img.height));
				drawRectangle(imageCtx, img, sx, sy, sw, sh, imageCanvas);
			} else if (shape === 'triangle') {
				const tw = 90;
				const th = 128;
				sx = Math.max(0, Math.min(img.width - tw, (x / imageCanvas.width) * img.width));
				sy = Math.max(0, Math.min(img.height - th, (y / imageCanvas.height) * img.height));
				drawTriangle(imageCtx, img, sx, sy, tw, th, imageCanvas);
			}

			generatePattern();
		}
	});

	function generatePattern() {
		if (shape === 'rectangle') {
			generateRectanglePattern(img, sx, sy, sw, sh, zoomLevel, rotation, patternCanvas, patternCtx);
		} else if (shape === 'triangle') {
			const tw = 90;
			const th = 128;
			generateTrianglePattern(img, sx, sy, tw, th, zoomLevel, rotation, patternCanvas, patternCtx);
		}
	}

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