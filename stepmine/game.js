document.oncontextmenu = function () {
    window.event.returnValue = false;
};

let canvas, ctx;
let mines, fogField, gameField;
let img, loadComplete = false;

let origin, focus, isOver, autoUnFog = [];
let animationQueue = [], animationMode = false;

const blockWidth = 30, blockHeight = 30, blockBorder = 2;
const fieldSize = 16;
const mineNum = 40;

const color = {
    border: "#595959",
    fog: "#33ccff",
    focus: "#FF9900",
    base: "#FFFFFF"
};

const mineColor = {
    1: "#004da4",
    2: "#0aa316",
    3: "#3b3b41",
    4: "#c40000",
    5: "#6b2776",
    6: "#af694b",
    7: "#bb801a",
    8: "#5d5bb8",
    9: "#123456"
};

document.addEventListener("keydown", onKeyDown);
init();

function init() {
    isOver = false;
    if (!loadComplete) {
        img = new Image();
        img.onload = function () {
            loadComplete = true;
        };
        img.src = "src/mine001.jpg";
    }
    //init game set
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    origin = getOrigin();
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mouseup", onMouseUp);

    //init data
    fogField = [];
    for (let i = 0; i < fieldSize; i++) {
        fogField[i] = [];
        for (let j = 0; j < fieldSize; j++) {
            fogField[i].push(0);
        }
    }

    mines = [];
    let totalBlocks = fieldSize * fieldSize;
    let lastMines = mineNum;
    for (let i = 0; i < fieldSize; i++) {
        mines[i] = [];
        for (let j = 0; j < fieldSize; j++) {
            if (Math.random() < lastMines / totalBlocks) {
                lastMines--;
                mines[i].push(1);
            } else {
                mines[i].push(0);
            }
            totalBlocks--;
        }
    }

    gameField = [];
    for (let i = 0; i < fieldSize; i++) {
        gameField[i] = [];
        for (let j = 0; j < fieldSize; j++) {
            let surMine = 0;
            if (mines[i][j]) {
                surMine = -1;
            } else {
                surMine = 0;
                if (i + 1 < fieldSize) {
                    surMine += mines[i + 1][j];
                }
                if (i - 1 >= 0) {
                    surMine += mines[i - 1][j];
                }
                if (j + 1 < fieldSize) {
                    surMine += mines[i][j + 1];
                }
                if (j - 1 >= 0) {
                    surMine += mines[i][j - 1];
                }
                if (i - 1 >= 0 && j - 1 >= 0) {
                    surMine += mines[i - 1][j - 1];
                }
                if (i - 1 >= 0 && j + 1 < fieldSize) {
                    surMine += mines[i - 1][j + 1];
                }
                if (i + 1 < fieldSize && j - 1 >= 0) {
                    surMine += mines[i + 1][j - 1];
                }
                if (i + 1 < fieldSize && j + 1 < fieldSize) {
                    surMine += mines[i + 1][j + 1];
                }
            }
            gameField[i][j] = surMine;
        }
    }

    //draw
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            let index = getIndexByCoordinate(i, j);
            drawBorder(index);
            clearDraw(index);
            drawGameField(index);
        }
    }
    clearMessage();
}

function drawMine(index, surMine, px) {
    if (surMine === 0) {
        return;
    }
    let o = getAnchorByIndex(index);
    if (surMine === -1) {
        if (loadComplete) {
            ctx.drawImage(img, o.x, o.y, blockWidth, blockHeight);
        } else {
            img.onload = function () {
                ctx.drawImage(img, o.x, o.y, blockWidth, blockHeight);
                loadComplete = true;
            }
        }
        return;
    }
    if (!px) {
        px = 20;
    }
    ctx.font = px + "pt Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = mineColor[surMine];
    ctx.fillText(surMine + "", o.x + Math.ceil(px / 4 * 3), o.y + Math.ceil(px / 4 * 5));
}

function drawGameField(index, isAnimation) {
    if (fogField[index.x][index.y]) {
        if (animationMode && isAnimation) {
            dealDrawAni(index, 3);
        } else {
            clearDraw(index);
            let surMine = gameField[index.x][index.y];
            drawMine(index, surMine);
        }
    } else {
        ctx.fillStyle = color.fog;
        let o = getAnchorByIndex(index);
        ctx.fillRect(o.x, o.y, blockWidth, blockHeight);
    }
}

function drawBorder(index, isFocus) {
    ctx.fillStyle = color.border;
    let o = getAnchorByIndex(index, true);
    if (isFocus) {
        ctx.fillRect(o.x, o.y, blockWidth + 2 * blockBorder, blockWidth + 2 * blockBorder);
    } else {
        ctx.fillRect(o.x, o.y, blockWidth + blockBorder, blockWidth + blockBorder);
        if (index.x === fieldSize - 1) {
            let l = getAnchorByIndex(getIndexByCoordinate(fieldSize, index.y), true);
            ctx.fillRect(l.x, l.y, blockBorder, blockHeight + blockBorder);
        }
        if (index.y === fieldSize - 1) {
            let b = getAnchorByIndex(getIndexByCoordinate(index.x, fieldSize), true);
            ctx.fillRect(b.x, b.y, blockWidth + blockBorder, blockBorder);
        }
        if (index.x === fieldSize - 1 && index.y === fieldSize - 1) {
            let lb = getAnchorByIndex(getIndexByCoordinate(fieldSize, fieldSize), true);
            ctx.fillRect(lb.x, lb.y, blockBorder, blockBorder);
        }
    }
}

function drawFocus(index) {
    clearDraw(index, true);
    drawBorder(index);

    let o = getAnchorByIndex(index, true);
    let w = Math.floor(blockWidth + blockBorder) / 3;
    let h = Math.floor(blockHeight + blockBorder) / 3;
    ctx.fillStyle = color.focus;
    ctx.fillRect(o.x, o.y, w, h);
    ctx.fillRect(o.x + blockWidth + blockBorder - w, o.y, w + blockBorder, h);
    ctx.fillRect(o.x, o.y + blockHeight + blockBorder - h, w, h + blockBorder);
    ctx.fillRect(o.x + blockWidth + blockBorder - w, o.y + blockHeight + blockBorder - h, w + blockBorder, h + blockBorder);

    drawGameField(index);
}

function clearFocus(index) {
    clearDraw(index, true, true);
    drawBorder(index, true);
    drawGameField(index);
}

function clearDraw(index, isBorder, isFocus) {
    let o = getAnchorByIndex(index, isBorder);
    if (isBorder) {
        if (isFocus) {
            ctx.clearRect(o.x, o.y, blockWidth + 2 * blockBorder, blockWidth + 2 * blockBorder);
        } else {
            ctx.clearRect(o.x, o.y, blockWidth + blockBorder, blockWidth + blockBorder);
        }
    } else {
        ctx.clearRect(o.x, o.y, blockWidth, blockWidth);
    }
}

function dealDrawAni(index, step) {
    const endWidth = blockWidth;// height too
    // const endTextPx = 20;
    const startWidth = 5;
    // const startTextPx = 2;
    let nowWidth = 5;
    // let nowTextPx = 2;
    let wStop = false;
    // let tStop = false;
    let wRange = Math.ceil((endWidth - startWidth) / step);
    // let tRange = Math.cbrt((endTextPx - startTextPx) / step);

    let wInterval;
    let wFun = (anchor) => {
        anchor = {x: anchor.x - Math.floor(nowWidth / 2), y: anchor.y - Math.floor(nowWidth / 2)};
        if (nowWidth < endWidth) {
            ctx.clearRect(anchor.x, anchor.y, nowWidth, nowWidth);
        } else {
            if (!wStop) {
                clearDraw(index);
                drawMine(index, gameField[index.x][index.y]);
                clearInterval(wInterval);
                animationQueue.shift();
                wStop = true;
            }
        }
        nowWidth += wRange;

        // if (nowTextPx < endTextPx) {
        //     drawMine(index, gameField[index.x][index.y], nowTextPx);
        // } else {
        //     if (!tStop) {
        //         drawMine(index, gameField[index.x][index.y]);
        //         tStop = true;
        //     }
        // }
        // nowTextPx += tRange;
        // if (wStop && tStop) {
        //     clearInterval(wInterval);
        //     animationQueue.shift();
        // }
    };
    animationQueue.push(1);
    wInterval = setInterval(() => {
        wFun(getCenterAnchorByIndex(index))
    }, 30);
}

function getOrigin() {
    let rect = canvas.getBoundingClientRect();
    return {x: Math.floor(rect.left), y: Math.floor(rect.top)};
}

function onMouseMove(e, isMouseLeave) {
    if (animationQueue.length > 0) {
        return;
    }
    let tFocus = null;

    if (isMouseLeave) {
        focus = null;
    } else {
        tFocus = getIndexByMousePos(getMousePos(e));
        if (tFocus !== null && !isFogByIndex(tFocus)) {
            tFocus = null;
        }
    }

    if (!tFocus) {
        if (focus) {
            clearFocus(focus);
        }
    } else {
        if (focus) {
            if (tFocus.x === focus.x && tFocus.y === focus.y) {
                return;
            } else {
                clearFocus(focus);
                drawFocus(tFocus);
            }
        } else {
            drawFocus(tFocus);
        }
    }
    focus = tFocus;
}

function onMouseLeave(e) {
    onMouseMove(e, true);
}

function onMouseUp(e, autoIndex) {
    if (!autoIndex && e.button !== 0) {
        return;
    }
    let index;
    if (autoIndex) {
        index = autoIndex;
    } else {
        index = getIndexByMousePos(getMousePos(e));
    }
    if (!index) {
        return;
    }
    if (fogField[index.x][index.y]) {
        return;
    }
    fogField[index.x][index.y] = 1;
    let surMine = gameField[index.x][index.y];
    if (surMine === 0) {
        if (index.x + 1 < fieldSize) {
            autoUnFog.push(getIndexByCoordinate(index.x + 1, index.y));
        }
        if (index.x - 1 >= 0) {
            autoUnFog.push(getIndexByCoordinate(index.x - 1, index.y));
        }
        if (index.y + 1 < fieldSize) {
            autoUnFog.push(getIndexByCoordinate(index.x, index.y + 1));
        }
        if (index.y - 1 >= 0) {
            autoUnFog.push(getIndexByCoordinate(index.x, index.y - 1));
        }
    }
    if (surMine === -1) {
        gameOver();
    }
    if (getLastMines() === getFogBlocks()) {
        gameWin();
    }
    drawGameField(index, true);
    while (autoUnFog.length > 0) {
        onMouseUp(null, autoUnFog.shift());
    }
}

function getMousePos(e) {
    return {x: e.x - origin.x, y: e.y - origin.y};
}

function getAnchorByIndex(index, isBorder) {
    if (isBorder) {
        return {x: index.x * 32, y: index.y * 32};
    } else {
        return {x: index.x * 32 + blockBorder, y: index.y * 32 + blockBorder};
    }
}

function getLastMines() {
    let sum = 0;
    for (let i = 0; i < mines.length; i++) {
        for (let j = 0; j < mines[i].length; j++) {
            sum += mines[i][j];
        }
    }
    return sum;
}

function getFogBlocks() {
    let sum = 0;
    for (let i = 0; i < fogField.length; i++) {
        for (let j = 0; j < fogField[i].length; j++) {
            if (!fogField[i][j]) {
                sum++;
            }
        }
    }
    return sum;
}

function getIndexByCoordinate(x, y) {
    return {x: x, y: y};
}

function getIndexByMousePos(pos) {
    let w = blockWidth + blockBorder;
    let h = blockHeight + blockBorder;
    if (pos.x % w - blockBorder >= 0 && pos.y % h - blockBorder >= 0) {
        let x = Math.floor(pos.x / w);
        let y = Math.floor(pos.y / h);
        if (x >= fieldSize || y >= fieldSize) {
            return null;
        }
        return {x: Math.floor(pos.x / w), y: Math.floor(pos.y / h)};
    } else {
        return null;
    }
}

function isFogByIndex(index) {
    return fogField[index.x][index.y] === 0;
}

function log(...o) {
    console.log(...o);
}

function gameOver(isWin) {
    isOver = true;
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseleave", onMouseLeave);
    canvas.removeEventListener("mouseup", onMouseUp);
    if (isWin) {
        drawMessage("YOU WIN! press 'SPACE' to restart game.");
    } else {
        drawMessage("GAME OVER, press 'SPACE' to restart game.");
    }
}

function gameWin() {
    gameOver(true);
}

function getCenterAnchorByIndex(index) {
    let o = getAnchorByIndex(index);
    return {x: o.x + blockWidth / 2, y: o.y + blockHeight / 2};
}

function onAniBtnClick() {
    let ele = document.getElementById("aniBtn");
    if (animationMode) {
        ele.innerText = "OFF";
    } else {
        ele.innerText = "ON";
    }
    animationMode = !animationMode;
}

function onKeyDown(e) {
    if (isOver && e.keyCode === 32) {
        init();
    }
}

function drawMessage(msg) {
    ctx.font = "16pt Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#272727";
    ctx.fillText(msg, 257, 550);
}

function clearMessage() {
    ctx.clearRect(0, 515, 514, 300);
}



