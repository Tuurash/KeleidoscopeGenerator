export function drawRectangle(canvasContext, imageElement, sourceX, sourceY, sourceWidth, sourceHeight, canvasElement) {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);
    canvasContext.strokeStyle = 'red';
    canvasContext.lineWidth = 2;
    const scaledX = sourceX * (canvasElement.width / imageElement.width);
    const scaledY = sourceY * (canvasElement.height / imageElement.height);
    const scaledWidth = sourceWidth * (canvasElement.width / imageElement.width);
    const scaledHeight = sourceHeight * (canvasElement.height / imageElement.height);
    canvasContext.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
}
export function generateRectanglePattern(imageElement, sourceX, sourceY, sourceWidth, sourceHeight, zoomLevel, rotationAngle, patternCanvasElement, patternCanvasContext, flipHorizontal, flipVertical) {
    const tempCanvas = document.createElement('canvas');
    const tempCanvasContext = tempCanvas.getContext('2d');
    tempCanvas.width = sourceWidth;
    tempCanvas.height = sourceHeight;
    tempCanvasContext.drawImage(imageElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
    const patternImage = new Image();
    patternImage.src = tempCanvas.toDataURL();
    patternImage.onload = () => {
        const tempPatternCanvas = document.createElement('canvas');
        const tempPatternCanvasContext = tempPatternCanvas.getContext('2d');
        tempPatternCanvas.width = patternCanvasElement.width;
        tempPatternCanvas.height = patternCanvasElement.height;
        tempPatternCanvasContext.clearRect(0, 0, tempPatternCanvas.width, tempPatternCanvas.height);
        const tileWidth = sourceWidth * zoomLevel;
        const tileHeight = sourceHeight * zoomLevel;
        const numCols = Math.ceil(tempPatternCanvas.width / tileWidth);
        const numRows = Math.ceil(tempPatternCanvas.height / tileHeight);
        for (let row = 0; row < numRows + 1; row++) {
            for (let col = 0; col < numCols + 1; col++) {
                const x = col * tileWidth;
                const y = row * tileHeight;
                tempPatternCanvasContext.save();
                tempPatternCanvasContext.translate(x, y);
                if ((col + row) % 2 === 0) {
                    tempPatternCanvasContext.scale(1, 1);
                }
                else {
                    tempPatternCanvasContext.scale(-1, 1);
                    tempPatternCanvasContext.translate(-tileWidth, 0);
                }
                if (flipHorizontal) {
                    tempPatternCanvasContext.scale(-1, 1);
                    tempPatternCanvasContext.translate(-tileWidth, 0);
                }
                if (flipVertical) {
                    tempPatternCanvasContext.scale(1, -1);
                    tempPatternCanvasContext.translate(0, -tileHeight);
                }
                tempPatternCanvasContext.drawImage(patternImage, 0, 0, tileWidth, tileHeight);
                tempPatternCanvasContext.restore();
            }
        }
        patternCanvasContext.clearRect(0, 0, patternCanvasElement.width, patternCanvasElement.height);
        patternCanvasContext.save();
        patternCanvasContext.translate(patternCanvasElement.width / 2, patternCanvasElement.height / 2);
        patternCanvasContext.rotate(rotationAngle * Math.PI / 180);
        patternCanvasContext.translate(-patternCanvasElement.width / 2, -patternCanvasElement.height / 2);
        patternCanvasContext.drawImage(tempPatternCanvas, 0, 0);
        patternCanvasContext.restore();
    };
}
//# sourceMappingURL=rectangle.js.map