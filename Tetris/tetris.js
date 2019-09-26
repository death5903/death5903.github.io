var scene;
var ctx;
var frame = 0;
var gameOver = false;
var aniQueue = { targets: [], clip: 0, active: false };
var main = function () {
    start();
    window.addEventListener("keydown", System.onKeyDownEvent);
};
var start = function () {
    ctx = document.getElementById("canvas").getContext("2d");
    scene = new Scene();
    scene.setPreBlock(BlockHelper.getRandomBlock());
    scene.setActiveBlock(BlockHelper.getRandomBlock());
    gameOver = false;
    requestAnimationFrame(update);
};
var update = function () {
    scene.update();
    if (!gameOver)
        requestAnimationFrame(update);
    else
        scene.drawGameOver();
};
window.onload = main;
var System = /** @class */ (function () {
    function System() {
    }
    System.log = function (o) {
        console.log(o);
    };
    System.onKeyDownEvent = function (evt) {
        if (gameOver) {
            if (evt.key === " ") {
                start();
            }
            return;
        }
        var key = evt.key;
        switch (key) {
            case "w":
            case "ArrowUp":
            case " ":
                //change direction
                var directions = BlockHelper.getDirections(scene.activeBlock);
                while (directions.length) {
                    var d = directions.shift();
                    var newBlock = new Block(scene.activeBlock.type, d, scene.activeBlock.i, scene.activeBlock.j);
                    if (scene.isAllowMove(BlockHelper.getPoints(newBlock))) {
                        scene.activeBlock.direction = d;
                        break;
                    }
                }
                break;
            case "s":
            case "ArrowDown":
                if (scene.activeBlock) {
                    scene.blockFall();
                }
                break;
            case "a":
            case "ArrowLeft":
                if (scene.activeBlock) {
                    var newBlock = new Block(scene.activeBlock.type, scene.activeBlock.direction, scene.activeBlock.i, scene.activeBlock.j - 1);
                    if (scene.isAllowMove(BlockHelper.getPoints(newBlock))) {
                        scene.activeBlock.j -= 1;
                    }
                }
                break;
            case "d":
            case "ArrowRight":
                if (scene.activeBlock) {
                    var newBlock = new Block(scene.activeBlock.type, scene.activeBlock.direction, scene.activeBlock.i, scene.activeBlock.j + 1);
                    if (scene.isAllowMove(BlockHelper.getPoints(newBlock))) {
                        scene.activeBlock.j += 1;
                    }
                }
                break;
        }
    };
    System.setup = {
        stage: { i: 20, j: 10 },
        block: { w: 10, h: 10 },
    };
    return System;
}());
var Scene = /** @class */ (function () {
    function Scene() {
        this.stage = [];
        this.stageRenderData = [];
        for (var i = 0; i < System.setup.stage.i; i++) {
            this.stage[i] = [];
            this.stageRenderData[i] = [];
            for (var j = 0; j < System.setup.stage.j; j++) {
                this.stage[i][j] = 0;
                this.stageRenderData[i][j] = { color: null };
            }
            // this.stage = [
            //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            //     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            //     [1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
            //     [1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            //     [1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
            //     [1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
            //     [1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            //     [1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
            //     [1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            //     [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
            // ];
        }
        /* stage */
        //border
        ctx.fillStyle = "dodgerblue";
        ctx.fillRect(20, 0, 222, 20);
        ctx.fillRect(20, 462, 222, 20);
        ctx.fillRect(0, 20, 20, 442);
        ctx.fillRect(242, 20, 20, 442);
        //prepare border
        // ctx.fillStyle = "orangered";
        // ctx.fillRect(308, 0, 164, 20);
        // ctx.fillRect(308, 130, 164, 20);
        // ctx.fillRect(288, 20, 20, 164);
        // ctx.fillRect(450, 20, 20, 164);
    }
    Scene.prototype.setActiveBlock = function (block) {
        this.activeBlock = block;
    };
    Scene.prototype.setPreBlock = function (block) {
        this.preBlock = block;
        this.renderPreBlock();
    };
    Scene.prototype.update = function () {
        if (frame === 30) {
            this.blockFall();
        }
        this.render();
        if (aniQueue.active) {
            if (!aniQueue.clip) {
                aniQueue.active = false;
            }
            this.handleAnimationAndCallback();
        }
        else {
            frame++;
        }
    };
    Scene.prototype.render = function () {
        /* stage block */
        //clear
        ctx.clearRect(20, 20, 222, 442);
        //ij
        for (var i = 0; i < this.stage.length; i++) {
            for (var j = 0; j < this.stage[i].length; j++) {
                if (this.stage[i][j]) {
                    SceneHelper.drawStageBlockByIJ(i, j, this.stageRenderData[i][j].color);
                }
            }
        }
        //activeBlock
        if (this.activeBlock) {
            var points = BlockHelper.getPoints(this.activeBlock);
            for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                var o = points_1[_i];
                if (o.i >= 0)
                    SceneHelper.drawStageBlockByIJ(o.i, o.j, BlockHelper.getColor(this.activeBlock));
            }
        }
    };
    Scene.prototype.renderPreBlock = function () {
        for (var i = 1; i <= 5; i++) {
            for (var j = 12; j <= 16; j++) {
                SceneHelper.drawStageBlockByIJ(i, j, "white");
            }
        }
        if (this.preBlock) {
            var points = BlockHelper.getPoints(this.preBlock);
            for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
                var o = points_2[_i];
                SceneHelper.drawStageBlockByIJ(o.i + 4, o.j + 10, BlockHelper.getColor(this.preBlock));
            }
        }
    };
    Scene.prototype.blockFall = function () {
        var targetPoints = BlockHelper.getPoints(new Block(this.activeBlock.type, this.activeBlock.direction, this.activeBlock.i + 1, this.activeBlock.j));
        if (this.isAllowMove(targetPoints)) {
            this.activeBlock.i++;
        }
        else {
            this.blockStuck();
            if (!gameOver)
                this.checkCompleteLines();
            // gameOver = true;
        }
        frame = -1;
    };
    Scene.prototype.blockStuck = function () {
        var points = BlockHelper.getPoints(this.activeBlock);
        var flag = false;
        for (var _i = 0, points_3 = points; _i < points_3.length; _i++) {
            var o = points_3[_i];
            if (o.i < 0) {
                flag = true;
                continue;
            }
            this.stage[o.i][o.j] = 1;
            this.stageRenderData[o.i][o.j].color = BlockHelper.getColor(this.activeBlock);
        }
        if (flag) {
            this.render();
            this.gameOver();
        }
        this.activeBlock = null;
    };
    Scene.prototype.checkCompleteLines = function () {
        var completeLines = [];
        for (var i = this.stage.length - 1; i >= 0; i--) {
            var flag = true;
            for (var j = 0; j < this.stage[i].length; j++) {
                if (!this.stage[i][j]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                completeLines.push(i);
            }
        }
        if (completeLines.length) {
            for (var i = 0; i < completeLines.length; i++) {
                aniQueue.targets.push(completeLines[i]);
                for (var j = 0; j < this.stage[completeLines[i]].length; j++) {
                    this.stage[completeLines[i]][j] = 0;
                }
            }
            aniQueue.active = true;
            aniQueue.clip = 10;
        }
        else {
            this.newTurn();
        }
    };
    Scene.prototype.handleAnimationAndCallback = function () {
        if (aniQueue.clip === 0) {
            this.animationCallback();
            aniQueue.targets.length = 0;
            aniQueue.active = false;
            return;
        }
        for (var i = 0; i < aniQueue.targets.length; i++) {
            for (var j = 0; j < this.stage[aniQueue.targets[i]].length; j++) {
                SceneHelper.drawStageBlockByAni(aniQueue.targets[i], j, this.stageRenderData[aniQueue.targets[i]][j].color, aniQueue.clip);
            }
        }
        aniQueue.clip--;
    };
    Scene.prototype.animationCallback = function () {
        var lines = aniQueue.targets;
        lines.sort(function (a, b) { return a - b; });
        for (var i = 0; i < lines.length; i++) {
            this.downStage(lines[i]);
        }
        this.newTurn();
    };
    Scene.prototype.downStage = function (i) {
        for (var k = i - 1; k >= 0; k--) {
            this.stage[k + 1] = this.stage[k];
            this.stageRenderData[k + 1] = this.stageRenderData[k];
        }
        this.stage[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.stageRenderData[0] = [{ color: null }, { color: null }, { color: null }, { color: null }, { color: null }, { color: null }, { color: null }, { color: null }, { color: null }, { color: null }];
    };
    Scene.prototype.newTurn = function () {
        this.activeBlock = this.preBlock;
        this.setPreBlock(BlockHelper.getRandomBlock());
        this.render();
        this.checkGameOver();
    };
    Scene.prototype.checkGameOver = function () {
        if (!this.isAllowMove(BlockHelper.getPoints(this.activeBlock))) {
            this.gameOver();
        }
    };
    Scene.prototype.gameOver = function () {
        System.log("GAME OVER!!");
        gameOver = true;
    };
    Scene.prototype.drawGameOver = function () {
        ctx.font = "20pt Arial";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER", 50, 225);
    };
    Scene.prototype.isAllowMove = function (targetPoints) {
        for (var _i = 0, targetPoints_1 = targetPoints; _i < targetPoints_1.length; _i++) {
            var o = targetPoints_1[_i];
            if (o.i < 0) {
                if (o.j > 9 || o.j < 0) {
                    return false;
                }
                else {
                    continue;
                }
            }
            if (o.i > 19) {
                return false;
            }
            if (o.j < 0 || o.j > 9) {
                return false;
            }
            if (this.stage[o.i][o.j]) {
                return false;
            }
        }
        return true;
    };
    Scene.prototype.isIAtAniQueue = function (i) {
        var targets = aniQueue.targets;
        for (var index = 0; index < targets.length; index++) {
            if (i === targets[index]) {
                return true;
            }
        }
        return false;
    };
    return Scene;
}());
var SceneHelper = /** @class */ (function () {
    function SceneHelper() {
    }
    SceneHelper.drawStageByIJ = function (i, j, color) {
        this.drawStageBorderByIJ(i, j);
        this.drawStageBlockByIJ(i, j, color);
    };
    SceneHelper.drawStageBorderByIJ = function (i, j) {
        ctx.fillStyle = "black";
        ctx.fillRect(20 + 22 * j, 20 + 22 * i, 24, 2);
        ctx.fillRect(20 + 22 * j, 20 + 22 * i, 2, 24);
        ctx.fillRect(20 + 22 * (j + 1), 20 + 22 * i, 2, 24);
        ctx.fillRect(20 + 22 * j, 20 + 22 * (i + 1), 24, 2);
    };
    SceneHelper.drawStageBlockByIJ = function (i, j, color) {
        ctx.fillStyle = color;
        ctx.fillRect(22 + 22 * j, 22 + 22 * i, 20, 20);
    };
    SceneHelper.drawStageBlockByAni = function (i, j, color, clip) {
        ctx.fillStyle = color;
        var lackPx = 20 - (20 * clip / 10);
        ctx.fillRect((22 + 22 * j) + lackPx / 2, (22 + 22 * i) + lackPx / 2, 20 - lackPx, 20 - lackPx);
    };
    return SceneHelper;
}());
var Block = /** @class */ (function () {
    function Block(type, direction, i, j) {
        if (i === void 0) { i = -1; }
        if (j === void 0) { j = 4; }
        this.i = i;
        this.j = j;
        this.type = type;
        this.direction = direction;
    }
    return Block;
}());
var BlockHelper = /** @class */ (function () {
    function BlockHelper() {
    }
    BlockHelper.getIJ = function (i, j) {
        return { i: i, j: j };
    };
    BlockHelper.getNextDirection = function (type, direction) {
        switch (type) {
            case 0:
                return 0;
            case 1:
            case 2:
            case 3:
                return (direction + 1) % 2;
            case 4:
            case 5:
            case 6:
                return (direction + 1) % 4;
        }
    };
    BlockHelper.getDirections = function (block) {
        var directions = [];
        var time = 0;
        switch (block.type) {
            case 1:
            case 2:
            case 3:
                time = 1;
                break;
            case 4:
            case 5:
            case 6:
                time = 3;
                break;
        }
        var d = block.direction;
        for (var i = 0; i < time; i++) {
            d = this.getNextDirection(block.type, d);
            directions.push(d);
        }
        return directions;
    };
    BlockHelper.getPoints = function (block) {
        var points = [];
        switch (block.type) {
            case 0:
                points.push(this.getIJ(block.i, block.j));
                points.push(this.getIJ(block.i, block.j + 1));
                points.push(this.getIJ(block.i + 1, block.j));
                points.push(this.getIJ(block.i + 1, block.j + 1));
                break;
            case 1:
                if (block.direction) {
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i, block.j + 2));
                }
                else {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i + 2, block.j));
                }
                break;
            case 2:
                if (block.direction) {
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i + 1, block.j - 1));
                }
                else {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i + 1, block.j + 1));
                }
                break;
            case 3:
                if (block.direction) {
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i - 1, block.j - 1));
                }
                else {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i + 1, block.j - 1));
                }
                break;
            case 4:
                if (block.direction === 0) {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i, block.j + 1));
                }
                else if (block.direction === 1) {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i, block.j + 1));
                }
                else if (block.direction === 2) {
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i + 1, block.j));
                }
                else if (block.direction === 3) {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i, block.j - 1));
                }
                break;
            case 5:
                if (block.direction === 0) {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i, block.j + 2));
                }
                else if (block.direction === 1) {
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i + 2, block.j));
                }
                else if (block.direction === 2) {
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i, block.j - 2));
                }
                else if (block.direction === 3) {
                    points.push(this.getIJ(block.i - 2, block.j));
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j - 1));
                }
                break;
            case 6:
                if (block.direction === 0) {
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i, block.j - 2));
                }
                else if (block.direction === 1) {
                    points.push(this.getIJ(block.i - 2, block.j));
                    points.push(this.getIJ(block.i - 1, block.j));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i, block.j + 1));
                }
                else if (block.direction === 2) {
                    points.push(this.getIJ(block.i, block.j + 2));
                    points.push(this.getIJ(block.i, block.j + 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                }
                else if (block.direction === 3) {
                    points.push(this.getIJ(block.i, block.j - 1));
                    points.push(this.getIJ(block.i, block.j));
                    points.push(this.getIJ(block.i + 1, block.j));
                    points.push(this.getIJ(block.i + 2, block.j));
                }
                break;
        }
        return points;
    };
    BlockHelper.getColor = function (block) {
        switch (block.type) {
            case 0:
                return "gray";
            case 1:
                return "limegreen";
            case 2:
                return "goldenrod";
            case 3:
                return "orangered";
            case 4:
                return "darkorchid";
            case 5:
                return "hotpink";
            case 6:
                return "maroon";
        }
    };
    BlockHelper.getRandomBlock = function () {
        var td = this.getRandomTypeAndDirection();
        return new Block(td.type, td.direction);
    };
    BlockHelper.getRandomTypeAndDirection = function () {
        var type = Math.floor(Math.random() * 7);
        var direction;
        switch (type) {
            case 0:
                direction = 0;
                break;
            case 1:
            case 2:
            case 3:
                direction = Math.floor(Math.random() * 2);
                break;
            case 4:
            case 5:
            case 6:
                direction = Math.floor(Math.random() * 4);
                break;
        }
        return { type: type, direction: direction };
    };
    return BlockHelper;
}());
