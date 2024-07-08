export function drawRectangle(imageCtx, img, sx, sy, sw, sh, imageCanvas) {
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
    imageCtx.strokeStyle = 'red';
    imageCtx.lineWidth = 2;
    imageCtx.strokeRect(sx * (imageCanvas.width / img.width), sy * (imageCanvas.height / img.height), sw * (imageCanvas.width / img.width), sh * (imageCanvas.height / img.height));
}
export function generateRectanglePattern(img, sx, sy, sw, sh, zoomLevel, rotation, patternCanvas, patternCtx) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = sw;
    tempCanvas.height = sh;
    tempCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    const patternImage = new Image();
    patternImage.src = tempCanvas.toDataURL();
    patternImage.onload = () => {
        const tempPatternCanvas = document.createElement('canvas');
        const tempPatternCtx = tempPatternCanvas.getContext('2d');
        tempPatternCanvas.width = patternCanvas.width;
        tempPatternCanvas.height = patternCanvas.height;
        tempPatternCtx.clearRect(0, 0, tempPatternCanvas.width, tempPatternCanvas.height);
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
                }
                else {
                    tempPatternCtx.scale(-1, 1);
                    tempPatternCtx.translate(-tw, 0);
                }
                tempPatternCtx.drawImage(patternImage, 0, 0, tw, th);
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
//# sourceMappingURL=rectangle.js.map