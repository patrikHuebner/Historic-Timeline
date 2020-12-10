const createCanvas = (params) => {
    // Create canvas
    let canvas = document.createElement('canvas');
    canvas.id = params.id;

    // Get the device pixel ratio, falling back to 1.
    let dpr = window.devicePixelRatio || 1;

    // Set size
    canvas.width = params.width * dpr;
    canvas.height = params.height * dpr;

    // Set CSS size properties for retina scaling
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // Create context
    let ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so we don't have to worry about the difference.
    ctx.scale(dpr, dpr);


    // Append canvas
    if (params.appendTo != undefined) {
        if (params.appendTo.toLowerCase() === 'body') {
            // Append to body
            document.getElementsByTagName(params.appendTo)[0].appendChild(canvas);
        } else {
            // Append to any other DIV
            document.getElementById(params.appendTo).appendChild(canvas);
        }
    }

    // Return canvas and context
    let result = {
        canvas: canvas,
        ctx: ctx
    };

    return result;

}




const resizeCanvas = (canvasReference) => {
    // Get the device pixel ratio, falling back to 1.
    let dpr = window.devicePixelRatio || 1;

    // Set size
    canvasReference.canvas.width = canvasReference.width * dpr;
    canvasReference.canvas.height = canvasReference.height * dpr;

    // Set CSS size properties for retina scaling
    canvasReference.canvas.style.width = '100%';
    canvasReference.canvas.style.height = '100%';

    // Scale all drawing operations by the dpr, so we don't have to worry about the difference.
    canvasReference.ctx.scale(dpr, dpr);
}


const getFontHeight = (ctx, text) => {
    let metrics = ctx.measureText(text);
    let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return actualHeight;
}



export { createCanvas, resizeCanvas, getFontHeight };