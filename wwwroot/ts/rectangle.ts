export function drawRectangle(
	canvasContext: CanvasRenderingContext2D,
	imageElement: HTMLImageElement,
	sourceX: number,
	sourceY: number,
	sourceWidth: number,
	sourceHeight: number,
	canvasElement: HTMLCanvasElement
) {
	// Clear the canvas
	canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

	// Draw the image onto the canvas
	canvasContext.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);

	// Set the rectangle style
	canvasContext.strokeStyle = 'red';
	canvasContext.lineWidth = 2;

	// Calculate the scaled rectangle coordinates and dimensions
	const scaledX = sourceX * (canvasElement.width / imageElement.width);
	const scaledY = sourceY * (canvasElement.height / imageElement.height);
	const scaledWidth = sourceWidth * (canvasElement.width / imageElement.width);
	const scaledHeight = sourceHeight * (canvasElement.height / imageElement.height);

	// Draw the rectangle
	canvasContext.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
}

// Function to generate a pattern from a rectangle region of an image
export function generateRectanglePattern(
	imageElement: HTMLImageElement,
	sourceX: number,
	sourceY: number,
	sourceWidth: number,
	sourceHeight: number,
	zoomLevel: number,
	rotationAngle: number,
	patternCanvasElement: HTMLCanvasElement,
	patternCanvasContext: CanvasRenderingContext2D,
	flipHorizontal: boolean,
	flipVertical: boolean
) {
	// Create a temporary canvas to extract the rectangle region from the image
	const tempCanvas = document.createElement('canvas');
	const tempCanvasContext = tempCanvas.getContext('2d');
	tempCanvas.width = sourceWidth;
	tempCanvas.height = sourceHeight;

	// Draw the specified rectangle region of the image onto the temporary canvas
	tempCanvasContext.drawImage(imageElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

	// Create an image element from the temporary canvas
	const patternImage = new Image();
	patternImage.src = tempCanvas.toDataURL();

	patternImage.onload = () => {
		// Create another temporary canvas to generate the pattern
		const tempPatternCanvas = document.createElement('canvas');
		const tempPatternCanvasContext = tempPatternCanvas.getContext('2d');
		tempPatternCanvas.width = patternCanvasElement.width;
		tempPatternCanvas.height = patternCanvasElement.height;

		// Clear the temporary pattern canvas
		tempPatternCanvasContext.clearRect(0, 0, tempPatternCanvas.width, tempPatternCanvas.height);

		// Calculate the dimensions of the tiles in the pattern
		const tileWidth = sourceWidth * zoomLevel;
		const tileHeight = sourceHeight * zoomLevel;

		// Calculate the number of rows and columns needed to fill the pattern canvas
		const numCols = Math.ceil(tempPatternCanvas.width / tileWidth);
		const numRows = Math.ceil(tempPatternCanvas.height / tileHeight);

		// Draw the pattern
		for (let row = 0; row < numRows + 1; row++) {
			for (let col = 0; col < numCols + 1; col++) {
				const x = col * tileWidth;
				const y = row * tileHeight;

				tempPatternCanvasContext.save();
				tempPatternCanvasContext.translate(x, y);

				// Alternate the scale for every other tile to create a mirrored effect
				if ((col + row) % 2 === 0) {
					tempPatternCanvasContext.scale(1, 1);
				} else {
					tempPatternCanvasContext.scale(-1, 1);
					tempPatternCanvasContext.translate(-tileWidth, 0);
				}

				// Apply horizontal and vertical flips
				if (flipHorizontal) {
					tempPatternCanvasContext.scale(-1, 1);
					tempPatternCanvasContext.translate(-tileWidth, 0);
				}
				if (flipVertical) {
					tempPatternCanvasContext.scale(1, -1);
					tempPatternCanvasContext.translate(0, -tileHeight);
				}

				// Draw the pattern image onto the temporary pattern canvas
				tempPatternCanvasContext.drawImage(patternImage, 0, 0, tileWidth, tileHeight);
				tempPatternCanvasContext.restore();
			}
		}

		// Clear the main pattern canvas
		patternCanvasContext.clearRect(0, 0, patternCanvasElement.width, patternCanvasElement.height);

		// Rotate and draw the pattern onto the main pattern canvas
		patternCanvasContext.save();
		patternCanvasContext.translate(patternCanvasElement.width / 2, patternCanvasElement.height / 2);
		patternCanvasContext.rotate(rotationAngle * Math.PI / 180);
		patternCanvasContext.translate(-patternCanvasElement.width / 2, -patternCanvasElement.height / 2);
		patternCanvasContext.drawImage(tempPatternCanvas, 0, 0);
		patternCanvasContext.restore();
	};
}