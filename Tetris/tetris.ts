let scene: Scene;
let ctx: CanvasRenderingContext2D;
let frame: number = 0;
let gameOver: boolean = false;
let aniQueue: { targets: number[], clip: number, active: boolean } = {targets: [], clip: 0, active: false};

const main = () => {
    start();
    window.addEventListener("keydown", System.onKeyDownEvent);
};
const start = () => {
    ctx = (<HTMLCanvasElement>document.getElementById("canvas")).getContext("2d");
    scene = new Scene();
    scene.setPreBlock(BlockHelper.getRandomBlock());
    scene.setActiveBlock(BlockHelper.getRandomBlock());
    gameOver = false;
    requestAnimationFrame(update);
};
const update = () => {
    scene.update();
    if (!gameOver)
        requestAnimationFrame(update);
    else
        scene.drawGameOver();
};

window.onload = main;

class System {

    public static setup = {
        stage: {i: 20, j: 10},
        block: {w: 10, h: 10},
    };

    public static log(o: any): void {
        console.log(o)
    }

    public static onKeyDownEvent(evt: KeyboardEvent) {
        if (gameOver) {
            if (evt.key === " ") {
                start();
            }
            return;
        }
        let key: string = evt.key;
        switch (key) {
            case "w":
            case "ArrowUp":
            case " ":
                //change direction
                let directions = BlockHelper.getDirections(scene.activeBlock);
                while (directions.length) {
                    let d = directions.shift();
                    let newBlock = new Block(scene.activeBlock.type, d, scene.activeBlock.i, scene.activeBlock.j);
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
                    let newBlock: Block = new Block(scene.activeBlock.type, scene.activeBlock.direction, scene.activeBlock.i, scene.activeBlock.j - 1);
                    if (scene.isAllowMove(BlockHelper.getPoints(newBlock))) {
                        scene.activeBlock.j -= 1;
                    }
                }
                break;
            case "d":
            case "ArrowRight":
                if (scene.activeBlock) {
                    let newBlock: Block = new Block(scene.activeBlock.type, scene.activeBlock.direction, scene.activeBlock.i, scene.activeBlock.j + 1);
                    if (scene.isAllowMove(BlockHelper.getPoints(newBlock))) {
                        scene.activeBlock.j += 1;
                    }
                }
                break;
        }
    }
}

class Scene {

    preBlock: Block;
    activeBlock: Block;
    stage: number[][];
    stageRenderData: { color: string }[][];

    constructor() {
        this.stage = [];
        this.stageRenderData = [];
        for (let i = 0; i < System.setup.stage.i; i++) {
            this.stage[i] = [];
            this.stageRenderData[i] = [];
            for (let j = 0; j < System.setup.stage.j; j++) {
                this.stage[i][j] = 0;
                this.stageRenderData[i][j] = {color: null};
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

    setActiveBlock(block: Block) {
        this.activeBlock = block;
    }

    setPreBlock(block: Block) {
        this.preBlock = block;
        this.renderPreBlock();
    }

    update() {
        if (frame === 30) {
            this.blockFall();
        }
        this.render();
        if (aniQueue.active) {
            if (!aniQueue.clip) {
                aniQueue.active = false;
            }
            this.handleAnimationAndCallback();
        } else {
            frame++;
        }
    }

    render() {
        /* stage block */
        //clear
        ctx.clearRect(20, 20, 222, 442);
        //ij
        for (let i = 0; i < this.stage.length; i++) {
            for (let j = 0; j < this.stage[i].length; j++) {
                if (this.stage[i][j]) {
                    SceneHelper.drawStageBlockByIJ(i, j, this.stageRenderData[i][j].color);
                }
            }
        }
        //activeBlock
        if (this.activeBlock) {
            let points = BlockHelper.getPoints(this.activeBlock);
            for (let o of points) {
                if (o.i >= 0)
                    SceneHelper.drawStageBlockByIJ(o.i, o.j, BlockHelper.getColor(this.activeBlock))
            }
        }
    }

    private renderPreBlock() {
        for (let i = 1; i <= 5; i++) {
            for (let j = 12; j <= 16; j++) {
                SceneHelper.drawStageBlockByIJ(i, j, "white");
            }
        }
        if (this.preBlock) {
            let points = BlockHelper.getPoints(this.preBlock);
            for (let o of points) {
                SceneHelper.drawStageBlockByIJ(o.i + 4, o.j + 10, BlockHelper.getColor(this.preBlock));
            }
        }
    }

    blockFall() {
        let targetPoints = BlockHelper.getPoints(new Block(this.activeBlock.type, this.activeBlock.direction, this.activeBlock.i + 1, this.activeBlock.j));
        if (this.isAllowMove(targetPoints)) {
            this.activeBlock.i++;
        } else {
            this.blockStuck();
            if (!gameOver)
                this.checkCompleteLines();
            // gameOver = true;
        }
        frame = -1;
    }

    blockStuck() {
        let points = BlockHelper.getPoints(this.activeBlock);
        let flag: boolean = false;
        for (let o of points) {
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
    }

    checkCompleteLines() {
        let completeLines: number[] = [];
        for (let i = this.stage.length - 1; i >= 0; i--) {
            let flag: boolean = true;
            for (let j = 0; j < this.stage[i].length; j++) {
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
            for (let i = 0; i < completeLines.length; i++) {
                aniQueue.targets.push(completeLines[i]);
                for (let j = 0; j < this.stage[completeLines[i]].length; j++) {
                    this.stage[completeLines[i]][j] = 0;
                }
            }
            aniQueue.active = true;
            aniQueue.clip = 10;
        } else {
            this.newTurn();
        }
    }


    handleAnimationAndCallback() {
        if (aniQueue.clip === 0) {
            this.animationCallback();
            aniQueue.targets.length = 0;
            aniQueue.active = false;
            return;
        }
        for (let i = 0; i < aniQueue.targets.length; i++) {
            for (let j = 0; j < this.stage[aniQueue.targets[i]].length; j++) {
                SceneHelper.drawStageBlockByAni(aniQueue.targets[i], j, this.stageRenderData[aniQueue.targets[i]][j].color, aniQueue.clip);
            }
        }
        aniQueue.clip--;
    }

    private animationCallback() {
        let lines = aniQueue.targets;
        lines.sort((a, b) => a - b);
        for (let i = 0; i < lines.length; i++) {
            this.downStage(lines[i]);
        }
        this.newTurn();
    }

    private downStage(i: number) {
        for (let k = i - 1; k >= 0; k--) {
            this.stage[k + 1] = this.stage[k];
            this.stageRenderData[k + 1] = this.stageRenderData[k];
        }
        this.stage[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.stageRenderData[0] = [{color: null}, {color: null}, {color: null}, {color: null}, {color: null}, {color: null}, {color: null}, {color: null}, {color: null}, {color: null}];
    }

    newTurn() {
        this.activeBlock = this.preBlock;
        this.setPreBlock(BlockHelper.getRandomBlock());
        this.render();
        this.checkGameOver();
    }

    checkGameOver() {
        if (!this.isAllowMove(BlockHelper.getPoints(this.activeBlock))) {
            this.gameOver();
        }
    }

    gameOver() {
        System.log("GAME OVER!!");
        gameOver = true;
    }

    drawGameOver() {
        ctx.font = "20pt Arial";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER", 50, 225);
    }

    isAllowMove(targetPoints: { i: number, j: number }[]): boolean {
        for (let o of targetPoints) {
            if (o.i < 0) {
                if (o.j > 9 || o.j < 0) {
                    return false;
                } else {
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
    }

    private isIAtAniQueue(i: number): boolean {
        let targets = aniQueue.targets;
        for (let index = 0; index < targets.length; index++) {
            if (i === targets[index]) {
                return true;
            }
        }
        return false;
    }
}

class SceneHelper {

    public static drawStageByIJ(i: number, j: number, color: string) {
        this.drawStageBorderByIJ(i, j);
        this.drawStageBlockByIJ(i, j, color);
    }

    public static drawStageBorderByIJ(i: number, j: number) {
        ctx.fillStyle = "black";
        ctx.fillRect(20 + 22 * j, 20 + 22 * i, 24, 2);
        ctx.fillRect(20 + 22 * j, 20 + 22 * i, 2, 24);
        ctx.fillRect(20 + 22 * (j + 1), 20 + 22 * i, 2, 24);
        ctx.fillRect(20 + 22 * j, 20 + 22 * (i + 1), 24, 2);
    }

    public static drawStageBlockByIJ(i: number, j: number, color: string) {
        ctx.fillStyle = color;
        ctx.fillRect(22 + 22 * j, 22 + 22 * i, 20, 20);
    }

    public static drawStageBlockByAni(i: number, j: number, color: string, clip: number) {
        ctx.fillStyle = color;
        let lackPx = 20 - (20 * clip / 10);
        ctx.fillRect((22 + 22 * j) + lackPx / 2, (22 + 22 * i) + lackPx / 2, 20 - lackPx, 20 - lackPx);
    }

}

class Block {

    i: number;
    j: number;
    type: number;
    direction: number;

    constructor(type: number, direction: number, i: number = -1, j: number = 4) {
        this.i = i;
        this.j = j;
        this.type = type;
        this.direction = direction;
    }
}

class BlockHelper {

    public static getIJ(i: number, j: number): { i: number, j: number } {
        return {i, j};
    }

    public static getNextDirection(type: number, direction: number): number {
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
    }

    public static getDirections(block: Block): number[] {
        let directions: number[] = [];
        let time = 0;
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
        let d = block.direction;
        for (let i = 0; i < time; i++) {
            d = this.getNextDirection(block.type, d);
            directions.push(d);
        }
        return directions;
    }


    public static getPoints(block: Block): { i: number, j: number }[] {
        let points = [];
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
                } else {
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
                } else {
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
                } else {
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
    }

    public static getColor(block: Block): string {
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
    }

    public static getRandomBlock(): Block {
        let td = this.getRandomTypeAndDirection();
        return new Block(td.type, td.direction);
    }

    private static getRandomTypeAndDirection(): { type: number, direction: number } {
        let type: number = Math.floor(Math.random() * 7);
        let direction: number;
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
        return {type, direction};
    }
}