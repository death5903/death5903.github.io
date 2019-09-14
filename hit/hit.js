const w = 640, h = 480, mw = w / 2, mh = h / 2;
let canvas, pencil, pencilStokeWidth = 6, audio;
let status = {
    isPressedButton: false
};
const shapeData = {
    hitButton: {w: 100, h: 50, c: "rgb(70,195,195)"},
    hitLeftCircle: {r: 25, c: "rgb(70,195,195)"},
    hitRightCircle: {r: 25, c: "rgb(70,195,195)"},
    hitText: {text: "HIT!", font: "normal 18px Verdana", c: "rgb(255,255,255)"},
    cubeStroke: {w: 120, h: 120},
    cubeFill: {c: "rgb(255,255,255)"}
};
const posData = {
    hitButton: {ox: mw - shapeData.hitButton.w / 2, oy: (mh + 100) + shapeData.hitButton.h / 2},
    hitLeftCircle: {
        ox: mw - shapeData.hitButton.w / 2,
        oy: (mh + 100 + shapeData.hitLeftCircle.r) + shapeData.hitButton.h / 2
    },
    hitRightCircle: {
        ox: mw + shapeData.hitButton.w / 2,
        oy: (mh + 100 + shapeData.hitRightCircle.r) + shapeData.hitButton.h / 2
    },
    hitText: {
        ox: mw - 18, oy: (mh + 106) + shapeData.hitButton.h
    },
    cube: {
        ox: mw - shapeData.cubeStroke.w / 2,
        oy: mh - shapeData.cubeStroke.h / 2,
    }
};
const textEventData = {
    hover: {c: "rgb(240,233,21)"},
    down: {c: "rgb(255,46,14)"}
};
let CLEAR = {
    HIT_BUTTON: {x: posData.hitButton.ox, y: posData.hitButton.oy, w: shapeData.hitButton.w, h: shapeData.hitButton.h}
};
let cubeQueue, shadowQueue, hitEffectQueue;

const log = (o) => {
    console.log(o);
};
const initialPointer = () => {
    canvas = document.getElementById("canvas");
    pencil = canvas.getContext("2d");
    pencil.strokeStyle = "#000000";
    pencil.lineWidth = pencilStokeWidth;
    cubeQueue = {draw: [], clear: []};
    shadowQueue = [];
    hitEffectQueue = [];
    audio = new Audio("hit.wav");
};
const setEvent = () => {
    canvas.addEventListener("mousemove", canvasMoveEvent);
    canvas.addEventListener("mousedown", canvasDownEvent);
    canvas.addEventListener("mouseup", canvasUpEvent);
};
const clearCanvas = (clearObj) => {
    pencil.clearRect(clearObj.x, clearObj.y, clearObj.w, clearObj.h);
};
const initialCanvas = () => {
    drawHitButton();
    drawHitButtonText();
};
const drawHitButton = (bColor = false, isOnlyButton = false) => {
    pencil.fillStyle = bColor ? bColor : shapeData.hitButton.c;
    pencil.fillRect(posData.hitButton.ox, posData.hitButton.oy, shapeData.hitButton.w, shapeData.hitButton.h);

    if (isOnlyButton)
        return;

    pencil.fillStyle = bColor ? bColor : shapeData.hitLeftCircle.c;
    pencil.beginPath();
    pencil.arc(posData.hitLeftCircle.ox, posData.hitLeftCircle.oy, shapeData.hitLeftCircle.r, 0, Math.PI * 2);
    pencil.fill();

    pencil.fillStyle = bColor ? bColor : shapeData.hitRightCircle.c;
    pencil.beginPath();
    pencil.arc(posData.hitRightCircle.ox, posData.hitRightCircle.oy, shapeData.hitRightCircle.r, 0, Math.PI * 2);
    pencil.fill();
};
const drawHitButtonText = (tColor = false, fontSize = false) => {
    pencil.font = fontSize ? shapeData.hitText.font.replace(/[0-9]*px/, fontSize + "px") : shapeData.hitText.font;
    pencil.fillStyle = tColor ? tColor : shapeData.hitText.c;
    pencil.fillText(shapeData.hitText.text, posData.hitText.ox, posData.hitText.oy);
};
const isHoverButton = (x, y) => {
    //rect
    let rectP = posData.hitButton;
    let rectS = shapeData.hitButton;
    if (x >= rectP.ox && x <= rectP.ox + rectS.w && y >= rectP.oy && y <= rectP.oy + rectS.h) {
        return true;
    }
    //left circle
    let lCirP = posData.hitLeftCircle;
    let lCirS = shapeData.hitLeftCircle;
    if (Math.pow(x - lCirP.ox, 2) + Math.pow(y - lCirP.oy, 2) <= Math.pow(lCirS.r, 2)) {
        return true;
    }
    //right circle
    let rCirP = posData.hitRightCircle;
    let rCirS = shapeData.hitRightCircle;
    if (Math.pow(x - rCirP.ox, 2) + Math.pow(y - rCirP.oy, 2) <= Math.pow(rCirS.r, 2)) {
        return true;
    }
    return false;
};
const canvasMoveEvent = (e) => {
    if (status.isPressedButton)
        return;

    if (!isHoverButton(e.layerX, e.layerY)) {
        clearCanvas(CLEAR.HIT_BUTTON);
        drawHitButton(false, true);
        drawHitButtonText(shapeData.hitText.c);
        return;
    }

    clearCanvas(CLEAR.HIT_BUTTON);
    drawHitButton(false, true);
    drawHitButtonText(textEventData.hover.c);
};
const canvasDownEvent = (e) => {
    if (!isHoverButton(e.layerX, e.layerY)) {
        return;
    }
    status.isPressedButton = true;
    clearCanvas(CLEAR.HIT_BUTTON);
    drawHitButton(false, true);
    drawHitButtonText(textEventData.down.c);
    createCubeQueueData();
    playHitAudio();
};
const canvasUpEvent = (e) => {
    if (!status.isPressedButton)
        return;
    status.isPressedButton = false;
    clearCanvas(CLEAR.HIT_BUTTON);
    drawHitButton(false, true);
    isHoverButton(e.layerX, e.layerY) ? drawHitButtonText(textEventData.hover.c) : drawHitButtonText(shapeData.hitText.c);
};

const getCubeDrawData = (ox = posData.cube.ox, oy = posData.cube.oy, c = shapeData.cubeFill.c) => {
    return {ox, oy, c};
};

const getShadowDrawData = (ox, oy, alpha) => {
    return {ox, oy, alpha};
};

const createCubeQueueData = (clipCount = null, shakeLength = null, angle = null, elasticity = null) => {
    if (!clipCount) {
        clipCount = Math.floor(Math.random() * 11) + 5;
    }
    if (!shakeLength) {
        shakeLength = Math.round(Math.random() * clipCount * 0.75) + 1;
    }
    if (!angle) {
        angle = Math.random() * 2 * Math.PI;
    }
    if (!elasticity) {
        elasticity = Math.floor(Math.random() * Math.floor(clipCount / 3)) + 1;
    }
    let p = {ox: posData.cube.ox, oy: posData.cube.oy};
    let clip;
    let clipColor = 1;
    let clipRange = 1 / (clipCount - elasticity);
    let clipShakeGoX = shakeLength / elasticity * Math.cos(angle);
    let clipShakeGoY = shakeLength / elasticity * Math.sin(angle);
    let clipShakeBackX = shakeLength / (clipCount - elasticity) * Math.cos(angle);
    let clipShakeBackY = shakeLength / (clipCount - elasticity) * Math.sin(angle);
    if (cubeQueue.draw.length) {
        cubeQueue.draw.length = 0;
        cubeQueue.draw.push(getCubeDrawData());
    }
    for (let i = 0; i < clipCount; i++) {
        if (i < elasticity) {
            p.ox += clipShakeGoX;
            p.oy += clipShakeGoY;
            clip = getCubeDrawData(p.ox, p.oy, getHitColor(clipColor));
            //handle shadow
            if (i === elasticity - 1) {
                createShadowQueueData(p.ox, p.oy, clipCount - i);
            }
        } else {
            p.ox -= clipShakeBackX;
            p.oy -= clipShakeBackY;
            clipColor -= clipRange;
            clip = getCubeDrawData(p.ox, p.oy, getHitColor(clipColor));
        }
        cubeQueue.draw.push(clip);
    }
    cubeQueue.draw.push(getCubeDrawData());
};

const createShadowQueueData = (ox, oy, frame) => {
    let alpha = 0.8;
    let alphaRange = 0.8 / frame;
    let tObj = {draw: [], clear: []};
    for (let f = 0; f < frame; f++) {
        tObj.draw.push(getShadowDrawData(ox, oy, alpha));
        alpha -= alphaRange;
    }
    shadowQueue.push(tObj);
    log(shadowQueue);
};

const getHitColor = (alpha) => {
    return "rgba(255,0,0," + alpha + ")";
};
const playHitAudio = () => {
    if (audio.currentTime) {
        audio.currentTime = 0;
    }
    audio.play();
};

const drawCube = () => {
    //handle clear
    let clearClip = cubeQueue.clear.shift();
    if (clearClip) {
        pencil.clearRect(clearClip.ox - pencilStokeWidth, clearClip.oy - pencilStokeWidth, shapeData.cubeStroke.w + 2 * pencilStokeWidth, shapeData.cubeStroke.h + 2 * pencilStokeWidth);
    }
    //handle draw
    let clip = cubeQueue.draw.shift();
    if (!clip) {
        clip = getCubeDrawData();
    }
    pencil.strokeRect(clip.ox, clip.oy, shapeData.cubeStroke.w, shapeData.cubeStroke.h);
    //這裡要填顏色
    pencil.fillStyle = clip.c;
    pencil.fillRect(clip.ox + pencilStokeWidth / 2, clip.oy + pencilStokeWidth / 2, shapeData.cubeStroke.w - pencilStokeWidth, shapeData.cubeStroke.h - pencilStokeWidth);
    //
    cubeQueue.clear.push(clip);
};

const drawShadow = () => {
    for (let obj of shadowQueue) {
        let clearClip = obj.clear.shift();
        if (clearClip) {
            pencil.clearRect(clearClip.ox - pencilStokeWidth, clearClip.oy - pencilStokeWidth, shapeData.cubeStroke.w + 2 * pencilStokeWidth, shapeData.cubeStroke.h + 2 * pencilStokeWidth);
        }
        let clip = obj.draw.shift();
        if (!clip) continue;
        pencil.strokeRect(clip.ox, clip.oy, shapeData.cubeStroke.w, shapeData.cubeStroke.h);
        pencil.fillStyle = "rgba(255,0,0," + clip.alpha + ")";
        pencil.fillRect(clip.ox + pencilStokeWidth / 2, clip.oy + pencilStokeWidth / 2, shapeData.cubeStroke.w - pencilStokeWidth, shapeData.cubeStroke.h - pencilStokeWidth);
        obj.clear.push(clip);
    }
    for (let i = 0; i < shadowQueue.length; i++) {
        if (shadowQueue[i].draw.length === 0 && shadowQueue[i].clear.length === 0) {
            shadowQueue.splice(i,1);
            i--;
        }
    }
};

const update = () => {
    log("update");
    // drawShadow();
    drawCube();
};

initialPointer();
setEvent();
initialCanvas();
setInterval(update, 16.6);

const drawHitEffect = () => {

};