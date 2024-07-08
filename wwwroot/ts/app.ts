// wwwroot/js/app.ts
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

			imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
			imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);

			if (shape === 'rectangle') {
				sx = Math.max(0, Math.min(img.width - sw, (x / imageCanvas.width) * img.width));
				sy = Math.max(0, Math.min(img.height - sh, (y / imageCanvas.height) * img.height));

				imageCtx.strokeStyle = 'red';
				imageCtx.lineWidth = 2;
				imageCtx.strokeRect(sx * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height), sw * (imageCanvas.width / img.width), sh * (imageCanvas.height / img.height));
			} else if (shape === 'triangle') {
				const tw = 90;
				const th = 128;
				sx = Math.max(0, Math.min(img.width - tw, (x / imageCanvas.width) * img.width));
				sy = Math.max(0, Math.min(img.height - th, (y / imageCanvas.height) * img.height));

				imageCtx.strokeStyle = 'blue';
				imageCtx.lineWidth = 2;
				imageCtx.beginPath();
				imageCtx.moveTo(sx * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height));
				imageCtx.lineTo(sx * (imageCanvas.width / img.width) + tw * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height));
				imageCtx.lineTo(sx * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height) + th * (imageCanvas.height / img.height));
				imageCtx.closePath();
				imageCtx.stroke();
			}

			generatePattern();
		}
	});

	function generatePattern() {
		const tempCanvas = document.createElement('canvas');
		const tempCtx = tempCanvas.getContext('2d');

		if (shape === 'rectangle') {
			tempCanvas.width = sw;
			tempCanvas.height = sh;
			tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
		} else if (shape === 'triangle') {
			const tw = 90;
			const th = 128;
			tempCanvas.width = tw;
			tempCanvas.height = th;

			tempCtx.beginPath();
			tempCtx.moveTo(0, 0);
			tempCtx.lineTo(tw, 0);
			tempCtx.lineTo(0, th);
			tempCtx.closePath();
			tempCtx.clip();

			tempCtx.drawImage(img, sx, sy, tw, th, 0, 0, tw, th);
		}

		const patternImage = new Image();
		patternImage.src = tempCanvas.toDataURL();

		patternImage.onload = () => {
			const tempPatternCanvas = document.createElement('canvas');
			const tempPatternCtx = tempPatternCanvas.getContext('2d');
			tempPatternCanvas.width = patternCanvas.width;
			tempPatternCanvas.height = patternCanvas.height;
			tempPatternCtx.clearRect(0, 0, tempPatternCanvas.width, tempPatternCanvas.height);

			if (shape === 'rectangle') {
				const tw = sw * zoomLevel;
				const th = sh * zoomLevel;
				const numCols = Math.ceil(tempPatternCanvas.width / tw);
				const numRows = Math.ceil(tempPatternCanvas.height / th);

				for (let row = 0; row < numRows + 1; row++) {
					for (let col = 0; col < numCols + 1; col++) {
						const x = col * tw;
						const y = row * th;

						tempPatternCtx.save();
						tempPatternCtx.translate(x, y);
						if ((col + row) % 2 === 0) {
							tempPatternCtx.scale(1, 1);
						} else {
							tempPatternCtx.scale(-1, 1);
							tempPatternCtx.translate(-tw, 0);
						}
						tempPatternCtx.drawImage(patternImage, 0, 0, tw, th);
						tempPatternCtx.restore();
					}
				}
			} else if (shape === 'triangle') {
				const tw = 90 * zoomLevel;
				const th = 128 * zoomLevel;
				const numCols = Math.ceil(tempPatternCanvas.width / tw);
				const numRows = Math.ceil(tempPatternCanvas.height / th);

				for (let row = 0; row < numRows + 1; row++) {
					for (let col = 0; col < numCols + 1; col++) {
						const x = col * tw;
						const y = row * th;

						tempPatternCtx.save();
						tempPatternCtx.translate(x, y);
						if ((col + row) % 2 === 0) {
							tempPatternCtx.scale(1, 1);
						} else {
							tempPatternCtx.scale(-1, 1);
							tempPatternCtx.translate(-tw, 0);
						}
						tempPatternCtx.drawImage(patternImage, 0, 0, tw, th);
						tempPatternCtx.restore();

						tempPatternCtx.save();
						tempPatternCtx.translate(x, y + th);
						tempPatternCtx.scale(1, -1);
						tempPatternCtx.drawImage(patternImage, 0, 0, tw, th);
						tempPatternCtx.restore();

						tempPatternCtx.save();
						tempPatternCtx.translate(x + tw, y + th);
						tempPatternCtx.scale(-1, -1);
						tempPatternCtx.drawImage(patternImage, 0, 0, tw, th);
						tempPatternCtx.restore();
					}
				}
			}

			patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);
			patternCtx.save();
			patternCtx.translate(patternCanvas.width / 2, patternCanvas.height / 2);
			patternCtx.rotate(rotation * Math.PI / 180);
			patternCtx.translate(-patternCanvas.width / 2, -patternCanvas.height / 2);
			patternCtx.drawImage(tempPatternCanvas, 0, 0);
			patternCtx.restore();
		};
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
