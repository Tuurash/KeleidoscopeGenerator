export function drawTriangle(imageCtx: CanvasRenderingContext2D, img: HTMLImageElement, sx: number, sy: number, tw: number, th: number, imageCanvas: HTMLCanvasElement) {
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.strokeStyle = 'blue';
    imageCtx.lineWidth = 2;
    imageCtx.beginPath();
    imageCtx.moveTo(sx * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height));
    imageCtx.lineTo(sx * (imageCanvas.width / img.width) + tw * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height));
    imageCtx.lineTo(sx * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height) + th * (imageCanvas.height / img.height));
    imageCtx.closePath();
    imageCtx.stroke();
}

export function generateTrianglePattern(img: HTMLImageElement, sx: number, sy: number, tw: number, th: number, zoomLevel: number, rotation: number, patternCanvas: HTMLCanvasElement, patternCtx: CanvasRenderingContext2D) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = tw;
    tempCanvas.height = th;

    tempCtx.beginPath();
    tempCtx.moveTo(0, 0);
    tempCtx.lineTo(tw, 0);
    tempCtx.lineTo(0, th);
    tempCtx.closePath();
    tempCtx.clip();

    tempCtx.drawImage(img, sx, sy, tw, th, 0, 0, tw, th);

    const patternImage = new Image();
    patternImage.src = tempCanvas.toDataURL();

    patternImage.onload = () => {
        const tempPatternCanvas = document.createElement('canvas');
        const tempPatternCtx = tempPatternCanvas.getContext('2d');
        tempPatternCanvas.width = patternCanvas.width;
        tempPatternCanvas.height = patternCanvas.height;
        tempPatternCtx.clearRect(0, 0, tempPatternCanvas.width, tempPatternCanvas.height);

        const twZoomed = tw * zoomLevel;
        const thZoomed = th * zoomLevel;
        const numCols = Math.ceil(tempPatternCanvas.width / twZoomed);
        const numRows = Math.ceil(tempPatternCanvas.height / thZoomed);

        for (let row = 0; row < numRows + 1; row++) {
            for (let col = 0; col < numCols + 1; col++) {
                const x = col * twZoomed;
                const y = row * thZoomed;

                tempPatternCtx.save();
                tempPatternCtx.translate(x, y);
                if ((col + row) % 2 === 0) {
                    tempPatternCtx.scale(1, 1);
                } else {
                    tempPatternCtx.scale(-1, 1);
                    tempPatternCtx.translate(-twZoomed, 0);
                }
                tempPatternCtx.drawImage(patternImage, 0, 0, twZoomed, thZoomed);
                tempPatternCtx.restore();

                tempPatternCtx.save();
                tempPatternCtx.translate(x, y + thZoomed);
                tempPatternCtx.scale(1, -1);
                tempPatternCtx.drawImage(patternImage, 0, 0, twZoomed, thZoomed);
                tempPatternCtx.restore();

                tempPatternCtx.save();
                tempPatternCtx.translate(x + twZoomed, y + thZoomed);
                tempPatternCtx.scale(-1, -1);
                tempPatternCtx.drawImage(patternImage, 0, 0, twZoomed, thZoomed);
                tempPatternCtx.restore();
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