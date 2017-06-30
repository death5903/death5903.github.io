/**
 * Created by CodingMaster on 2017/6/27.
 */

// dom
    var btn = document.querySelector(".btn");
    var blackBack = document.querySelector(".blackBack");
    var hint = document.querySelector(".hint");
    btn.addEventListener("click",function () {
        hint.classList.remove("off");
        blackBack.classList.remove("off");
    });
    blackBack.addEventListener("click",function () {
        hint.classList.add("off");
        this.classList.add("off");
    });
////

var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

var aBullets = [];
var aFishs = [];
var aItems = [];
var aMessages = [];

var bulletCD = false;
var bulletCDTime = 400;

var mouseX = 0;
var mouseY = 0;

var score = 500;
var cost = 10;

var itemAppearTime = 0;
var itemEffect = {
    bf: 0,
    b2: 0,
    bb: 0
};

var coordinateColor = "rgba(0,0,0,.2)";
var stunCoorColor = false;

var turrentPic = document.createElement("img");
turrentPic.src = "resource/img/turrent.png";
var hasEmission = 0;

var mobileInterval;
var mouseInterval;

// for (var i = 0; i < 5; i++) {
//     var fType = getRandomFishData();
//     var fRPA = getRandomPositionAndAngle();
//     var f = new RectFish(fRPA.x, fRPA.y, fType.w, fType.h, fType.v, fRPA.angle, null, fType.dp, fType.rate,fType.fi,fType.apt);
//     aFishs.push(f);
// }
// var item = new Item(500, 500, 1);
// aItems.push(item);
// var item2 = new Item(500, 500, 2);
// aItems.push(item2);
// var item3 = new Item(500, 500, 3);
// aItems.push(item3);

window.addEventListener("keydown", function (e) {
    // console.log(e.keyCode);
    if (e.keyCode === 32) {
        e.preventDefault();
        emissionBullet();
    }
    if(e.keyCode === 81){
        e.preventDefault();
        score += 100;
    }
});
canvas.addEventListener("mousedown", function (e) {
    if (e.button === 0 ) {
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        emissionBullet();
        mouseInterval = setInterval(emissionBullet, 200);
    }
});
window.addEventListener("mouseup", function (e) {
    clearInterval(mouseInterval);
});
window.addEventListener("resize", function () {
    init();
});
window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
window.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        emissionBullet();
        mobileInterval = setInterval(emissionBullet, 200);
    }
});
window.addEventListener("touchend", function () {
    clearInterval(mobileInterval);
});
window.addEventListener("touchmove", function (e) {
    if (e.touches.length === 1) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
});
window.addEventListener("orientationchange", function () {
    init();
});

refreshFrame();

function refreshFrame() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(refreshFrame);

    generateRandomFish();
    generateRandomItem();

    drawAllObject();

    drawCoordinate();
    drawScore();
    drawItemEffortTimeBar();
    drawTurret();
    reduceItemTime();
}

//畫座標格線
function drawCoordinate() {
    for (var i = 0; i < 20; i++) {
        c.beginPath();
        if (itemEffect.bf > 0 || itemEffect.b2 > 0 || itemEffect.bb > 0) {
            if (!stunCoorColor) {
                coordinateColor = getRandomCoorColor();
                stunCoorColor = true;
            }
        } else {
            coordinateColor = "rgba(0,0,0,.2)";
            if (stunCoorColor === true) {
                stunCoorColor = false;
            }
        }
        c.strokeStyle = coordinateColor;
        c.moveTo(0, 100 * i);
        c.lineTo(2000, 100 * i);
        c.moveTo(100 * i, 0);
        c.lineTo(100 * i, 2000);
        c.stroke();
        c.closePath();
    }
}

//方型魚
function RectFish(ox, oy, w, h, v, dir, color, dp, rate, fi, apt) {
    this.ox = ox;
    this.oy = oy;
    this.dox = ox - w / 2;
    this.doy = oy - h / 2;
    this.w = w;
    this.h = h;
    this.v = v;
    this.dir = dir;
    this.color = color;
    this.nx = changeCoordinateForFish(ox, oy, dir).x;
    this.ny = changeCoordinateForFish(ox, oy, dir).y;
    this.dx = transDistance(this.nx, this.ny, ox, oy).x;
    this.dy = transDistance(this.nx, this.ny, ox, oy).y;

    this.dp = dp;
    this.rate = rate;
    this.isHit = false;
    this.hitByBig = false;
    this.isDestroy = false;
    this.fi = fi;
    this.apt = apt;
    this.pic = (function (fi) {
        var p = document.createElement('img');
        p.src = "resource/img/fish_" + fi + ".png";
        return p;
    })(this.fi);
    this.beGot = false;

    this.draw = function () {
        this.nx = changeCoordinateForFish(this.ox, this.oy, this.dir).x;
        this.ny = changeCoordinateForFish(this.ox, this.oy, this.dir).y;
        this.dx = transDistance(this.nx, this.ny, this.ox, this.oy).x;
        this.dy = transDistance(this.nx, this.ny, this.ox, this.oy).y;
        if (this.isHit) {
            c.beginPath();
            c.rotate(Math.PI / 180 * this.dir);
            c.fillStyle = "rgba(255,0,0,.5)";
            c.translate(this.dx, this.dy);
            c.fillRect(this.dox, this.doy, this.w, this.h);
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.closePath();
        }
        c.beginPath();
        c.rotate(Math.PI / 180 * this.dir);
        c.translate(this.dx, this.dy);
        c.drawImage(this.pic, this.dox, this.doy, this.w, this.h);
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.closePath();
    };

    this.update = function () {
        this.updateState();
        this.updateFishs();
        this.draw();
    };

    this.updateState = function () {
        if (this.isDestroy) {
            this.w *= 0.75;
            this.h *= 0.75;
        }
        this.ox = this.ox + this.v * Math.cos(Math.PI / 180 * this.dir);
        this.oy = this.oy + this.v * Math.sin(Math.PI / 180 * this.dir);
        this.dox = this.ox - this.w / 2;
        this.doy = this.oy - this.h / 2;


        this.isHit = false;
        next:
            for (var i = 0; i < aBullets.length; i++) {
                // console.log(aBullets[i].checkPoint);
                if (aBullets[i] !== null) {
                    for (var j = 0; j < aBullets[i].checkPoint.length; j++) {
                        var b = aBullets[i].checkPoint[j];

                        var n = changeCoordinateForBullet(b.x, b.y, this.dir);
                        var nx = n.x;
                        var ny = n.y;

                        if (nx - this.dx > this.dox && nx - this.dx < (this.dox + this.w) && ny - this.dy > this.doy && ny - this.dy < (this.doy + this.h)) {
                            this.isHit = true;
                            if (aBullets[i].mr === 50) {
                                this.hitByBig = true;
                                // console.log("BIG HIT!");
                            } else {
                                this.hitByBig = false;
                                // console.log("NORMAL HIT!");
                            }
                            aBullets[i].broke = true;
                            break next;
                        }
                    }
                }
            }
        if (this.isHit === true) {
            if (!this.isDestroy) {
                var ndp = this.dp;
                if (this.hitByBig) {
                    ndp *= 2;
                    // console.log("NDPX2:"+ndp);
                }
                // console.log("NDP:"+ndp);
                if (Math.random() < ndp) {
                    this.isDestroy = true;
                    this.beGot = true;
                    score += (itemEffect.b2 > 0) ? (this.rate * 2 * cost) : (this.rate * cost);
                    itemAppearTime += this.apt;
                }
            }
        }
    };

    this.updateFishs = function () {
        if ((this.ox < -200 || this.ox > canvas.width + 200 || this.oy < -200 || this.oy > canvas.height + 200) || this.w < 10 || this.h < 10) {
            for (var j = 0; j < aFishs.length; j++) {
                if (aFishs[j] === this) {
                    aFishs[j] = null;
                    if (this.beGot) {
                        var prize = this.rate * cost;
                        if (itemEffect.b2 > 0) {
                            prize += "X2";
                        }
                        aMessages.push(new Message("+" + prize, this.ox, this.oy, 50, "200,160,0", "Arial"));
                    }
                    // console.log("魚: " + aFishs.length);
                    break;
                }
            }
        }
        // if (!(this.ox < -200 || this.ox > canvas.width + 200 || this.oy < -200 || this.oy > canvas.height + 200)) {
        //     var bPush = true;
        //     for (var i = 0; i < aFishs.length; i++) {
        //         if (aFishs[i] === this) {
        //             bPush = false;
        //             break;
        //         }
        //     }
        //     if (bPush) {
        //         aFishs.push(this);
        //     }
        // } else {
        //     for (var j = 0; j < aFishs.length; j++) {
        //         if (aFishs[j] === this) {
        //             aFishs.splice(j, 1);
        //             break;
        //         }
        //     }
        // }
    }
}

//子彈
function Bullet(ox, oy, mr, v, dir) {
    this.ox = ox;
    this.oy = oy;
    this.r = 2;
    this.mr = mr;
    this.v = v;
    this.dir = dir;
    this.checkPoint = [];
    this.broke = false;
    this.colorDeep = 200;

    this.draw = function () {

        if (!this.broke) {
            //畫出子彈偵測點
            // for (var i = 0; i < this.checkPoint.length; i++) {
            //     var p = this.checkPoint[i];
            //     c.beginPath();
            //     c.strokeStyle = "#0017ce";
            //     c.strokeRect(p.x, p.y, 1, 1);
            //     c.stroke();
            //     c.closePath();
            // }
            c.beginPath();
            c.fillStyle = (this.mr === 20) ? ("rgba(0,100,150,.5)") : ("rgba(200,0,0,.5)");
            c.arc(this.ox, this.oy, this.r, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();
            c.beginPath();
            c.fillStyle = (this.mr === 20) ? ("rgba(0,100,150,.5)") : ("rgba(200,0,0,.5)");
            c.arc(this.ox, this.oy, this.r * 0.6, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();

            if (this.r < this.mr) {
                (this.r * 1.1 < this.mr) ? (this.r *= 1.1) : (this.r = this.mr);
            }

        } else {
            c.beginPath();
            c.fillStyle = (this.mr === 20) ? ("rgb(0,150," + this.colorDeep + ")") : (("rgb(" + this.colorDeep + ",50,0)"));
            c.arc(this.ox, this.oy, this.r, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();

            this.colorDeep -= 10;
            this.r *= 0.85;
        }
    };

    this.update = function () {
        this.updateState();
        this.updateBulltes();
        this.draw();
    };

    this.updateState = function () {
        this.ox = this.ox + this.v * Math.sin(dir - Math.PI / 2);
        this.oy = this.oy + this.v * Math.cos(dir - Math.PI / 2);

        this.checkPoint = (function (ox, oy, r, broke) {
            var aPoint = [];
            if (!broke) {
                for (var i = 0; i < 8; i++) {
                    var p = {
                        x: ox + r * Math.cos(Math.PI / 180 * 45 * i),
                        y: oy + r * Math.sin(Math.PI / 180 * 45 * i)
                    };
                    aPoint.push(p);
                }
            }
            return aPoint;
        })(this.ox, this.oy, this.r, this.broke);
    };

    this.updateBulltes = function () {
        if ((this.ox < -100 || this.ox > canvas.width + 100 || this.oy < -100 || this.oy > canvas.height + 100) || this.r < 1) {
            for (var j = 0; j < aBullets.length; j++) {
                if (aBullets[j] === this) {
                    // aBullets.splice(j, 1);
                    aBullets[j] = null;
                    // console.log("子彈: " + aBullets.length);
                    break;
                }
            }
        }
        //     var bPush = true;
        //     for (var i = 0; i < aBullets.length; i++) {
        //         if (aBullets[i] === this) {
        //             bPush = false;
        //             break;
        //         }
        //     }
        //     if (bPush) {
        //         aBullets.push(this);
        //     }
        // }
        // if (!(this.ox < -100 || this.ox > canvas.width +100 || this.oy < -100 || this.oy > canvas.height +100) && this.r > 1) {
        //     var bPush = true;
        //     for (var i = 0; i < aBullets.length; i++) {
        //         if (aBullets[i] === this) {
        //             bPush = false;
        //             break;
        //         }
        //     }
        //     if (bPush) {
        //         aBullets.push(this);
        //     }
        // } else {
        //     for (var j = 0; j < aBullets.length; j++) {
        //         if (aBullets[j] === this) {
        //             aBullets.splice(j, 1);
        //             break;
        //         }
        //     }
        // }
    }
}

//道具
function Item(ox, oy, iI) {
    this.ox = ox;
    this.oy = oy;
    this.w = iI === 3 ? 250 : 200;
    this.h = iI === 3 ? 250 : 200;
    this.dox = ox - this.w / 2;
    this.doy = oy - this.h / 2;
    this.fox = ox - 25;
    this.foy = oy + 25;
    this.fw = 200;
    this.fh = 200;
    this.fdox = this.fox - this.fw / 2;
    this.fdoy = this.foy - this.fh / 2;
    this.beGot = false;
    this.used = false;
    this.timeOut = 480;
    this.iI = iI;
    this.picName = (function (iI) {
        switch (iI) {
            case 1:
                return "resource/img/bullet_free_";
            case 2:
                return "resource/img/bonus_x2_";
            case 3:
                return "resource/img/bigger_bullet_";
        }
    })(this.iI);
    this.animeIndex = 0;
    this.animeStay = 0;
    this.reverseAnime = false;
    this.pics = [];

    this.draw = function () {
        c.beginPath();
        c.drawImage(this.pics[this.animeIndex], this.dox, this.doy, this.w, this.h);
        c.closePath();
    };

    this.update = function () {
        this.updateState();
        this.updateItems();
        this.draw();
    };

    this.updateState = function () {
        if (this.pics.length === 0) {
            for (var p = 0; p < 10; p++) {
                var pic = document.createElement("img");
                pic.src = this.picName + p + ".png";
                this.pics.push(pic);
            }
        }
        this.timeOut--;
        this.animeStay++;

        if (this.animeStay % 3 === 0) {
            if (!this.reverseAnime) {
                (this.animeIndex < 9) ? (this.animeIndex++) : (this.reverseAnime = true);
            } else {
                (this.animeIndex > 0) ? (this.animeIndex--) : (this.reverseAnime = false);
            }
        }

        if (!this.beGot && this.timeOut > 0) {
            skip:
                for (var i = 0; i < aBullets.length; i++) {
                    if (aBullets[i] !== null) {
                        for (var j = 0; j < aBullets[i].checkPoint.length; j++) {
                            var b = aBullets[i].checkPoint[j];
                            var x = b.x;
                            var y = b.y;
                            if (this.iI !== 3) {
                                if (x > this.dox && x < this.dox + this.w && y > this.doy && y < this.doy + this.h) {
                                    this.beGot = true;
                                    break skip;
                                }
                            } else {
                                if (x > this.fdox && x < this.fdox + this.fw && y > this.fdoy && y < this.fdoy + this.fh) {
                                    this.beGot = true;
                                    break skip;
                                }
                            }
                        }
                    }
                }
        } else {
            if (!this.used && this.timeOut > 0) {
                //產生道具效果
                switch (this.iI) {
                    case 1:
                        itemEffect.bf += 600;
                        break;
                    case 2:
                        itemEffect.b2 += 600;
                        break;
                    case 3:
                        itemEffect.bb += 600;
                        break;
                }
                this.used = true;
            }
            this.w *= 0.75;
            this.h *= 0.75;
            this.dox = this.ox - this.w / 2;
            this.doy = this.oy - this.h / 2;
            if (this.iI === 3) {
                this.fdox = this.fox - this.fw / 2;
                this.fdoy = this.foy - this.fh / 2;
            }
        }
    };

    this.updateItems = function () {
        if (this.w < 10) {
            for (var i = 0; i < aItems.length; i++) {
                if (aItems[i] === this) {
                    aItems[i] = null;
                    if (this.used) {
                        aMessages.push(new Message("Item GET!", this.ox, this.oy, 30, "0,170,140", "Arial"));
                    }
                    // console.log("道具: " + aItems.length);
                    break;
                }
            }
        }
    };
}

//訊息
function Message(m, ox, oy, mPx, color, font) {
    this.m = m;
    this.ox = ox;
    this.oy = oy;
    this.px = 4;
    this.mPx = mPx;
    this.color = color;
    this.font = font;
    this.reverseAnime = false;
    this.bs = 1;
    this.animeStay = 0;
    this.colorAlpha = 0.05;

    this.draw = function () {
        c.beginPath();
        c.font = this.px + "px " + this.font;
        c.fillStyle = "rgba(" + this.color + "," + this.colorAlpha + ")";
        c.textAlign = "center";
        c.fillText(this.m, this.ox, this.oy);
        c.closePath();
    };

    this.update = function () {
        this.updateState();
        this.updateMessages();
        this.draw();
    };

    this.updateState = function () {
        if (this.animeStay <= 15) {
            if (this.colorAlpha < 1) {
                this.colorAlpha += 0.05;
            } else {
                this.colorAlpha = 1;
            }
            // console.log("a+: " + this.colorAlpha);
        }
        if (!this.reverseAnime) {
            if (this.px < this.mPx) {
                if (this.px + this.bs < this.mPx) {
                    this.px += this.bs;
                } else {
                    this.px = this.mPx;
                    this.reverseAnime = true;
                }
            }
        } else {
            this.animeStay++;
        }
        if (this.animeStay > 15) {
            this.oy -= 1;
            if (this.colorAlpha > 0) {
                this.colorAlpha -= 0.05;
            } else {
                this.colorAlpha = 0;
            }
            // console.log("y: " + this.oy);
            // console.log("stay: " + this.animeStay);
            // console.log("a-: " + this.colorAlpha);
        }
    };

    this.updateMessages = function () {
        if (this.animeStay > 30 && this.colorAlpha === 0) {
            for (var i = 0; i < aMessages.length; i++) {
                if (aMessages[i] === this) {
                    aMessages[i] = null;
                    // console.log("訊息: " + aMessages.length);
                }
            }
        }
    };


}

//魚類碰撞座標轉換
function changeCoordinateForFish(x, y, angle) {
    var newAngle = -angle;
    var nx = x * Math.cos(Math.PI / 180 * newAngle) - y * Math.sin(Math.PI / 180 * newAngle);
    var ny = x * Math.sin(Math.PI / 180 * newAngle) + y * Math.cos(Math.PI / 180 * newAngle);
    return {x: nx, y: ny};
}

//子彈碰撞座標轉換
function changeCoordinateForBullet(x, y, angle) {
    var newAngle = angle;
    var nx = x * Math.cos(Math.PI / 180 * newAngle) + y * Math.sin(Math.PI / 180 * newAngle);
    var ny = -x * Math.sin(Math.PI / 180 * newAngle) + y * Math.cos(Math.PI / 180 * newAngle);
    return {x: nx, y: ny};
}

//座標轉換位移向量
function transDistance(nx, ny, x, y) {
    return {x: (nx - x), y: (ny - y)};
}

//遊戲方法
function init() {
    aBullets = [];
    aFishs = [];
    aItems = [];
    aMessages = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function generateRandomFish(){
    var token = Math.random();
    if (token < 0.01) {
        var fType = getRandomFishData();
        var fRPA = getRandomPositionAndAngle();
        // var f = new RectFish(fRPA.x, fRPA.y, 200, 200, 2, fRPA.angle, null, 0.15, 6,0);
        // var f = new RectFish(fRPA.x, fRPA.y, 300, 200, 2, fRPA.angle, null, 0.15, 6,1);
        // var f = new RectFish(fRPA.x, fRPA.y, 300, 50, 6, fRPA.angle, null, 0.15, 6,2);
        // var f = new RectFish(fRPA.x, fRPA.y, 100, 100, 10, fRPA.angle, null, 0.15, 10, 3);
        var f = new RectFish(fRPA.x, fRPA.y, fType.w, fType.h, fType.v / 2, fRPA.angle, null, fType.dp, fType.rate, fType.fi, fType.apt);
        aFishs.push(f);
    }
}
function generateRandomItem(){
    if (itemAppearTime > 0) {
        var token = Math.random();
        if (token < 0.002) {
            var iData = getRandomItemData();
            var item = new Item(iData.x, iData.y, iData.i);
            aItems.push(item);
            itemAppearTime *= 0.75;
            itemAppearTime -= 200;
            // console.log("道具出現: " + iData.i);
        }
    }
}

function drawAllObject(){
    for (var i = 0; i < aBullets.length; i++) {
        if (aBullets[i] !== null)
            aBullets[i].update();
    }
    for (var j = 0; j < aFishs.length; j++) {
        if (aFishs[j] !== null) {
            aFishs[j].update();
        }
    }
    for (var k = 0; k < aItems.length; k++) {
        if (aItems[k] !== null) {
            aItems[k].update();
        }
    }
    for (var l = 0; l < aMessages.length; l++) {
        if (aMessages[l] !== null) {
            aMessages[l].update();
        }
    }
}

function reduceItemTime() {

    for (var i in itemEffect) {
        (itemEffect[i] > 0) ? (itemEffect[i]--) : (0);
        // console.log(i + ": " + itemEffect[i]);
    }

    if (itemAppearTime > 0) {
        itemAppearTime--;
    } else if (itemAppearTime < 0) {
        itemAppearTime = 0;
    }
}
function drawScore() {
    c.beginPath();
    c.font = "60px Arial";
    c.textAlign = "center";
    if (itemEffect.bf > 0) {
        c.fillStyle = "rgba(0,150,200,.5)";
    } else {
        c.fillStyle = "rgba(0,0,0,.5)";
    }
    c.fillText("SCORE: " + score, canvas.width / 2, 60);
    c.closePath();
}
function drawTurret() {
    c.beginPath();
    c.drawImage(turrentPic, canvas.width / 2 - 10, canvas.height - 50, 20, 50);
    c.closePath();
    if (hasEmission !== 0) {
        switch (hasEmission) {
            case 1:
                drawEmissionSuccess();
                hasEmission = 0;
                break;
            case 2:
                drawEmissionfail();
                hasEmission = 0;
                break;
        }
    }
    function drawEmissionSuccess() {
        c.beginPath();
        c.strokeStyle = "#00bece";
        c.arc(canvas.width / 2, canvas.height - 45, 10, 0, Math.PI * 2, false);
        c.stroke();
        c.closePath();
    }

    function drawEmissionfail() {
        c.beginPath();
        c.strokeStyle = "#ff0000";
        c.lineWidth = "5px";
        c.arc(canvas.width / 2, canvas.height - 45, 10, 0, Math.PI * 2, false);
        c.stroke();
        c.closePath();
    }
}
function drawItemEffortTimeBar() {
    var px = canvas.width - 200;
    var py = [canvas.height - 150, canvas.height - 120, canvas.height - 90, canvas.height - 180];
    if (itemEffect.bf > 0) {
        c.beginPath();
        c.fillStyle = "#00ff79";
        c.textAlign = "left";
        c.font = "20px Arial";
        c.fillText("BulletFree", px, py[0]);
        c.closePath();
        c.beginPath();
        c.strokeStyle = "#00bece";
        c.moveTo(px, py[0] + 5);
        var w = itemEffect.bf / 10;
        if (w > 90) {
            w = 90;
            c.strokeStyle = "#ce0500";
        }
        c.lineTo(px + w, py[0] + 5);
        c.stroke();
        c.closePath()
    }

    if (itemEffect.b2 > 0) {
        c.beginPath();
        c.fillStyle = "#ff6e00";
        c.textAlign = "left";
        c.font = "20px Arial";
        c.fillText("Bonus X2", px, py[1]);
        c.closePath();
        c.beginPath();
        c.strokeStyle = "#00bece";
        c.moveTo(px, py[1] + 7);
        var w1 = itemEffect.b2 / 10;
        if (w1 > 90) {
            w1 = 90;
            c.strokeStyle = "#ce0500";
        }
        c.lineTo(px + w1, py[1] + 7);
        c.stroke();
        c.closePath()
    }

    if (itemEffect.bb > 0) {
        c.beginPath();
        c.fillStyle = "#c700ff";
        c.textAlign = "left";
        c.font = "20px Arial";
        c.fillText("BiggerBullet", px, py[2]);
        c.closePath();
        c.beginPath();
        c.strokeStyle = "#00bece";
        c.moveTo(px, py[2] + 9);
        var w2 = itemEffect.bb / 10;
        if (w2 > 90) {
            w2 = 90;
            c.strokeStyle = "#ce0500";
        }
        c.lineTo(px + w2, py[2] + 9);
        c.stroke();
        c.closePath()
    }

    if (itemAppearTime > 0) {
        c.beginPath();
        c.fillStyle = "#636363";
        c.textAlign = "left";
        c.font = "20px Arial";
        c.fillText("ItemAppear", px, py[3]);
        c.closePath();
        c.beginPath();
        c.strokeStyle = "#00bece";
        c.moveTo(px, py[3] + 9);
        var w3 = itemAppearTime / 10;
        if (w3 > 90) {
            w3 = 90;
            c.strokeStyle = "#ce0500";
        }
        c.lineTo(px + w3, py[3] + 9);
        c.stroke();
        c.closePath()
    }
}

function getRandomFishData() {
    var aFishType = [];
    aFishType[0] = {w: 200, h: 200, v: 2, dp: 0.12, rate: 5, fi: 0, apt: 360};
    aFishType[1] = {w: 300, h: 200, v: 2, dp: 0.12, rate: 5, fi: 1, apt: 300};
    aFishType[2] = {w: 300, h: 50, v: 6, dp: 0.2, rate: 8, fi: 2, apt: 360};
    aFishType[3] = {w: 100, h: 100, v: 10, dp: 1, rate: 15, fi: 3, apt: 480};
    aFishType[4] = {w: 400, h: 300, v: 1.25, dp: 0.025, rate: 50, fi: 4, apt: 720};

    var token = Math.random();

    if (token < 0.3) {
        return aFishType[0];
    }
    else if (token >= 0.3 && token < 0.65) {
        return aFishType[1];
    }
    else if (token >= 0.65 && token < 0.85) {
        return aFishType[2];
    }
    else if (token >= 0.85 && token < 0.90) {
        return aFishType[3];
    } else {
        return aFishType[4];
    }
}
function getRandomPositionAndAngle() {
    var aRPA = [];
    aRPA[0] = {
        x: Math.floor(Math.random() * canvas.width),
        y: -200,
        angle: Math.floor(Math.random() * 160) + 10
    };
    aRPA[1] = {
        x: canvas.width + 200,
        y: Math.floor(Math.random() * canvas.height),
        angle: Math.floor(Math.random() * 160) + 100
    };
    aRPA[2] = {
        x: Math.floor(Math.random() * canvas.width),
        y: canvas.height + 200,
        angle: Math.floor(Math.random() * 160) + 190
    };
    aRPA[3] = {
        x: -200,
        y: Math.floor(Math.random() * canvas.height),
        angle: (function () {
            var a = (Math.random() > 0.5) ? (Math.floor(Math.random() * 80)) : (Math.floor(Math.random() * 80) + 280);
            return a;
        })()
    };

    var token = Math.floor(Math.random() * 4);
    return aRPA[token];
}
function getRandomItemData() {
    var ox = Math.random() * (canvas.width - 200) + 100;
    var oy = Math.random() * (canvas.height - 200) + 100;
    var iI = Math.floor(Math.random() * 3) + 1;
    return {x: ox, y: oy, i: iI};
}
function emissionBullet() {
    var ox = canvas.width / 2;
    var oy = canvas.height - 50;
    var v = -5;
    var dir = Math.atan2(canvas.height - mouseY, mouseX - canvas.width / 2);
    var mr = (itemEffect.bb > 0) ? (50) : (20);
    if (!bulletCD && (score >= cost || itemEffect.bf > 0)) {
        bulletCD = true;
        aBullets.push(new Bullet(ox, oy, mr, v, dir));
        hasEmission = 1;
        if (itemEffect.bf === 0) {
            score -= cost;
        }
        setTimeout(function () {
            bulletCD = false
        }, bulletCDTime);
    } else if (!bulletCD && score < cost && itemEffect.bf === 0) {
        bulletCD = true;
        aMessages.push(new Message("餘額不足!", canvas.width / 2, canvas.height - 70, 20, "0,0,0", "標楷體"));
        hasEmission = 2;
        setTimeout(function () {
            bulletCD = false
        }, bulletCDTime);
    }
}
function getRandomCoorColor() {
    var i = Math.floor(Math.random() * 3);
    switch (i) {
        case 0:
            return "rgba(255,0,0,.2)";
        case 1:
            return "rgba(0,155,0,.4)";
        case 2:
            return "rgba(0,0,255,.2)";
    }
}


