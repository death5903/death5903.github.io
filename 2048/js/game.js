/** ***** 設定全域變數 ****** */
var gameBoard;// 棋盤(16格)
var showGameBoard;
var sizeX = 4;// 棋盤寬
var sizeY = 4;// 棋盤高
var animationQueue = [];
var score = 0;
var round = 0;
var scoreChange = false;
var scoreUp = 0;
var tempDivs = [];

var showScore;
var forResetScoreValueAni;
var showRound;
var forResetRoundValueAni;
var btnStart;
var btnLeft;
var btnRight;
var btnTop;
var btnDown;
var gameOverPic;
var scoreAndRound;

var loader;
var dots;
var screen;
/** ********************* */
/** ***** 定義 Item 物件 ****** */
var Item = function(px, py) {
	this.px = px;
	this.py = py;
	this.className = "block2";
	this.itemValue = (Math.random() < 0.1) ? 4 : 2;
	this.hasMerge = false;
	this.born = true;
};

Item.prototype = {
	left : function() {
		// //尋找tx專用的變數
		var tpx = this.px;
		var tpy = this.py;
		var titemValue = this.itemValue;
		// //
		var tx = function() {
			var rtx = tpx;
			var rtx2 = rtx;
			while (rtx2 - 1 >= 0) {
				rtx2--;
				if (gameBoard[rtx2][tpy] == null) {
					rtx = rtx2;
				} else if (gameBoard[rtx2][tpy].itemValue == titemValue
						&& gameBoard[rtx2][tpy].hasMerge == false) {
					rtx = rtx2;
					break;
				} else {
					break;
				}
			}
			return rtx;
		}();
		var ty = this.py;
		// console.log("當前位置:" + this.px + "," + this.py);
		// console.log("目標位置:" + tx + "," + ty);
		if (this.px != tx) {
			if (gameBoard[tx][ty] != null) {
				this.itemValue *= 2;
				this.hasMerge = true;
				score += this.itemValue;
				scoreUp += this.itemValue;
				;
			}
			gameBoard[tx][ty] = gameBoard[this.px][this.py];
			gameBoard[this.px][this.py] = null;
			/** *將改變訊息放入動畫列** */
			var msg = {
				direction : "horizontal",
				px : this.px,
				py : this.py,
				tx : tx,
				ty : ty
			};
			animationQueue.push(msg);
			/** **************** */
			this.px = tx;
		}

	},
	right : function() {
		// //尋找tx專用的變數
		var tpx = this.px;
		var tpy = this.py;
		var titemValue = this.itemValue;
		// //
		var tx = function() {
			var rtx = tpx;
			var rtx2 = rtx;
			while (rtx2 + 1 < sizeX) {
				rtx2++;
				if (gameBoard[rtx2][tpy] == null) {
					rtx = rtx2;
				} else if (gameBoard[rtx2][tpy].itemValue == titemValue
						&& gameBoard[rtx2][tpy].hasMerge == false) {
					rtx = rtx2;
					break;
				} else {
					break;
				}
			}
			return rtx;
		}();
		var ty = this.py;
		// console.log("當前位置:" + this.px + "," + this.py);
		// console.log("目標位置:" + tx + "," + ty);
		if (this.px != tx) {
			if (gameBoard[tx][ty] != null) {
				this.itemValue *= 2;
				this.hasMerge = true;
				score += this.itemValue;
				scoreUp += this.itemValue;
				;
			}
			gameBoard[tx][ty] = gameBoard[this.px][this.py];
			gameBoard[this.px][this.py] = null;
			/** *將改變訊息放入動畫列** */
			var msg = {
				direction : "horizontal",
				px : this.px,
				py : this.py,
				tx : tx,
				ty : ty
			};
			animationQueue.push(msg);
			/** **************** */
			this.px = tx;
		}
	},
	top : function() {
		// //尋找ty專用的變數
		var tpx = this.px;
		var tpy = this.py;
		var titemValue = this.itemValue;
		// //
		var tx = this.px;
		var ty = function() {
			var rty = tpy;
			var rty2 = rty;
			while (rty2 - 1 >= 0) {
				rty2--;
				if (gameBoard[tpx][rty2] == null) {
					rty = rty2;
				} else if (gameBoard[tpx][rty2].itemValue == titemValue
						&& gameBoard[tpx][rty2].hasMerge == false) {
					rty = rty2;
					break;
				} else {
					break;
				}
			}
			return rty;
		}();
		// console.log("當前位置:" + this.px + "," + this.py);
		// console.log("目標位置:" + tx + "," + ty);
		if (this.py != ty) {
			if (gameBoard[tx][ty] != null) {
				this.itemValue *= 2;
				this.hasMerge = true;
				score += this.itemValue;
				scoreUp += this.itemValue;
			}
			gameBoard[tx][ty] = gameBoard[this.px][this.py];
			gameBoard[this.px][this.py] = null;
			/** *將改變訊息放入動畫列** */
			var msg = {
				direction : "vertical",
				px : this.px,
				py : this.py,
				tx : tx,
				ty : ty
			};
			animationQueue.push(msg);
			/** **************** */
			this.py = ty;
		}
	},
	down : function() {
		// //尋找ty專用的變數
		var tpx = this.px;
		var tpy = this.py;
		var titemValue = this.itemValue;
		// //
		var tx = this.px;
		var ty = function() {
			var rty = tpy;
			var rty2 = rty;
			while (rty2 + 1 < sizeY) {
				rty2++;
				if (gameBoard[tpx][rty2] == null) {
					rty = rty2;
				} else if (gameBoard[tpx][rty2].itemValue == titemValue
						&& gameBoard[tpx][rty2].hasMerge == false) {
					rty = rty2;
					break;
				} else {
					break;
				}
			}
			return rty;
		}();
		// console.log("當前位置:" + this.px + "," + this.py);
		// console.log("目標位置:" + tx + "," + ty);
		if (this.py != ty) {
			if (gameBoard[tx][ty] != null) {
				this.itemValue *= 2;
				this.hasMerge = true;
				score += this.itemValue;
				scoreUp += this.itemValue;
				;
			}
			gameBoard[tx][ty] = gameBoard[this.px][this.py];
			gameBoard[this.px][this.py] = null;
			/** *將改變訊息放入動畫列** */
			var msg = {
				direction : "vertical",
				px : this.px,
				py : this.py,
				tx : tx,
				ty : ty
			};
			animationQueue.push(msg);
			/** **************** */
			this.py = ty;
		}
	}
};
/** **************************** */
/** *******初始動畫******** */
window.onload = function() {

	screen = document.getElementById("screen");
	loader = document.getElementById("loader");
	dots = document.getElementsByClassName("dot");

	var tl = new TimelineMax({
		repeat : 1,
		onComplete : onContent
	});

	tl.staggerFromTo(dots, 0.5, {
		y : -50,
		autoAlpha : 0
	}, {
		y : 0,
		autoAlpha : 1,
		ease : Back.easeInOut
	}, 0.2).fromTo(loader, 0.5, {
		autoAlpha : 1,
		scale : 1.3
	}, {
		autoAlpha : 0,
		scale : 1,
		ease : Power0.easeNone
	});

};
/** *********************** */
/** *******內容畫面初始化******* */
function onContent() {
	var tlLoaderOut = new TimelineLite({
		onComplete : loadContent
	});
	tlLoaderOut.to(loader, 0.3, {
		autoAlpha : 1,
		scale : 1.3,
		ease : Power0.easeNone
	}).staggerFromTo(dots, 0.3, {
		y : 0,
		autoAlpha : 1,
		rotation : 0
	}, {
		y : -150,
		autoAlpha : 0,
		rotation : 1080,
		ease : Back.easeInOut
	}, 0.05, 0).to(screen, 0.3, {
		autoAlpha : 0,
		ease : Power0.easeNone
	});
}

function loadContent() {

	if (screen.parentNode) {
		screen.parentNode.removeChild(screen);
	}
	if (loader.parentNode) {
		loader.parentNode.removeChild(loader);
	}

	showScore = document.getElementById("scoreValue");
	forResetScoreValueAni = document.getElementById("forResetScoreValueAni");

	showRound = document.getElementById("roundValue");
	forResetRoundValueAni = document.getElementById("forResetRoundValueAni");

	scoreAndRound = document.getElementById("scoreAndRound");

	btnStart = document.getElementById("btnStart");
	btnStart.onclick = gameStart;
	btnStart.style.display = "inline-block";
	btnStart.style.animationName = "startAni";

	btnLeft = document.getElementById("btnLeft");
	btnLeft.onclick = clickLeft;
	btnLeft.style.display = "none";

	btnRight = document.getElementById("btnRight");
	btnRight.onclick = clickRight;
	btnRight.style.display = "none";

	btnTop = document.getElementById("btnTop");
	btnTop.onclick = clickTop;
	btnTop.style.display = "none";

	btnDown = document.getElementById("btnDown");
	btnDown.onclick = clickDown;
	btnDown.style.display = "none";

	gameOverPic = document.getElementById("gameOverPic");

	btnLog = document.getElementById("btnLog");
	btnLog.onclick = function() {
		showLog(gameBoard);
	};

	document.onkeydown = onKeyDownEvent;
}
/** *********************** */
/** *******棋盤初始化******** */
function init() {
	// 定義二維陣列
	gameBoard = new Array(sizeX);
	for (var x = 0; x < sizeX; x++) {
		gameBoard[x] = new Array(sizeY);
	}
	score = 0;
	round = 0;
}
/** ******************** */
/** *******DOM初始化******** */
function showInit() {
	showGameBoard = document.getElementById("showGameBoard");
	// 創造子div
	var createChildDivs = function() {
		var str = "";
		for (var x = 0; x < sizeX; x++) {
			for (var y = 0; y < sizeY; y++) {
				str += "<div id=\"div" + x + "_" + y
						+ "\" class=\"block\" style=\"left:" + (150 * x + 10)
						+ "px;top:" + (150 * y + 10) + "px\"></div>";
			}
		}
		return str;
	}();
	showGameBoard.innerHTML = createChildDivs;
	forResetRoundValueAni.innerHTML = "<div id=\"roundValue\">" + round
			+ "</div>";
	showRound = document.getElementById("roundValue");
}
/** ******************** */
/** **隨機獲得棋盤中一個空的位置(決定新產生方塊的位置)*** */
function getRandomEmptyPosition(gameBoard) {
	var list = [];// 所有的空位置
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (!gameBoard[x][y]) {
				list.push("" + x + y);
			}
		}
	}
	// console.log(list);
	if (list.length == 0) { // 若沒有空位 返回 false不新增方塊
		return false;
	}
	return list[parseInt(Math.random() * list.length)];
}
// 產生一個新的方塊
function addNewItem() {
	var i = getRandomEmptyPosition(gameBoard);
	if (i !== false) {
		var px = parseInt(i.charAt(0));
		var py = parseInt(i.charAt(1));
		// console.log("產生新方塊的位置在:("+px+","+py+")");
		var item = new Item(px, py);
		gameBoard[px][py] = item;
		var nDiv = document.getElementById("div" + item.px + "_" + item.py);
		nDiv.className = item.className;
		nDiv.innerHTML = item.itemValue;
		if (item.born) {
			nDiv.style.animationName = "bornAni";
			item.born = false;
		}
	} else {
		console.log("*****空位不足,無法新增方塊*****");
		console.log("*****此訊息不可能出現在遊戲中*****");
		console.log("*****若見此訊息,請修復遊戲BUG*****");
		return;
	}
	// showGameBoardToPlayer(gameBoard);
}
/** ***************************** */
/** ***********將方塊顯示給玩家的方法*********** */
function showGameBoardToPlayer(gameBoard) {
	showInit();
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (gameBoard[x][y] != null) {
				var item = gameBoard[x][y];
				var div = document.getElementById("div" + item.px + "_"
						+ item.py);
				if (item.itemValue > 9999) {
					item.className = "block3";
				}
				div.className = item.className;
				div.innerHTML = item.itemValue;
				if (item.born) {
					div.style.animationName = "bornAni";
					item.born = false;
				}
				if (item.hasMerge) {
					div.style.animationName = "biggerAni";
					// console.log("設定biggerAni動畫 to " + div.id);
					scoreChange = true;
				}
				// console.log("更新方塊狀態:");
				// console.log("id:" + div.id + ",px:" + item.px + ",py:"
				// + item.py + ",class:" + item.className + ",value:"
				// + item.itemValue);
			} else {
				var div = document.getElementById("div" + x + "_" + y);
				div.className = "block";
				div.innerHTML = "";
			}
		}
	}
	showScore.innerHTML = score;
	if (scoreChange) {
		forResetScoreValueAni.innerHTML = "<div id=\"scoreValue\">" + score
				+ "</div>";
		showScore = document.getElementById("scoreValue");
		showScore.style.animationName = "numberChangeAni";

		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = "+" + scoreUp;
		tempDiv.classList.add("scoreValueUp");
		scoreAndRound.appendChild(tempDiv);
		tempDivs.push(tempDiv);

		scoreUp = 0;

		setTimeout(function() {
			scoreAndRound.removeChild(tempDivs.shift());
		}, 750);

		scoreChange = false;
	}
	showRound.innerHTML = round;
	showRound.style.animationName = "numberChangeAni";
}
/** ********************************* */
/** ***** 開發專用 查詢物件內容 ******* */
function showLog(gameBoard) {
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (gameBoard[x][y]) {
				console.log(gameBoard[x][y]);
			}
		}
	}
}
/** ****************************** */
/** ***** 重置合併紀錄 ****** */
function resetMerge() {
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (gameBoard[x][y] && gameBoard[x][y].hasMerge) {
				gameBoard[x][y].hasMerge = false;
			}
		}
	}
	// console.log("已重置合併紀錄");
}
/** ********************* */
/*
 * function resetAnimation() { var sgb =
 * document.getElementById("showGameBoard"); var divs =
 * sgb.getElementsByTagName("div"); var temp = setInterval(function() { for (
 * var i = 0; i < divs.length; i++) { if (divs[i].style.animationName) {
 * remove(divs[i].style.animationName); } } clearInterval(temp);
 * console.log("已重置CSS動畫屬性"); }, 500); }
 */
/** *******動畫函數 && 播放動畫函數********* */
function movingAnimation(direction, px, py, tx, ty) {

	var div = document.getElementById("div" + px + "_" + py);
	var dx = (tx - px) * 150;
	var dy = (ty - py) * 150;
	var startx = px * 150 + 10;
	var starty = py * 150 + 10;
	var endx = tx * 150 + 10;
	var endy = ty * 150 + 10;

	var frame;
	var sx = startx;
	var stepdx = parseInt(dx / 30);
	var sy = starty;
	var stepdy = parseInt(dy / 30);

	if (direction == "horizontal") {
		frame = function() {
			sx += stepdx;
			div.style.left = sx + "px";
			if (stepdx < 0 && sx <= endx) {
				clearInterval(animation);
				// div.style.display = "none";
				// div.style.left = startx + "px";
				animationQueue.shift();
				// console.log("動畫播放結束,目前動畫數量:" + animationQueue.length);
				if (animationQueue.length == 0) {
					round++;
					showGameBoardToPlayer(gameBoard);
					resetMerge();
					// resetAnimation();
					unLockButtons();
					addNewItem();
					testGameOver();
				}
			} else if (stepdx > 0 && sx >= endx) {
				clearInterval(animation);
				// div.style.display = "none";
				// div.style.left = startx + "px";
				animationQueue.shift();
				// console.log("動畫播放結束,目前動畫數量:" + animationQueue.length);
				if (animationQueue.length == 0) {
					round++;
					showGameBoardToPlayer(gameBoard);
					resetMerge();
					// resetAnimation();
					unLockButtons();
					addNewItem();
					testGameOver();
				}
			}
		};
	} else if (direction == "vertical") {
		frame = function() {
			sy += stepdy;
			div.style.top = sy + "px";
			if (stepdy < 0 && sy <= endy) {
				clearInterval(animation);
				// div.style.display = "none";
				// div.style.top = starty + "px";
				animationQueue.shift();
				// console.log("動畫播放結束,目前動畫數量:" + animationQueue.length);
				if (animationQueue.length == 0) {
					round++;
					showGameBoardToPlayer(gameBoard);
					resetMerge();
					// resetAnimation();
					unLockButtons();
					addNewItem();
					testGameOver();
				}
			} else if (stepdy > 0 && sy >= endy) {
				clearInterval(animation);
				// div.style.display = "none";
				// div.style.top = starty + "px";
				animationQueue.shift();
				// console.log("動畫播放結束,目前動畫數量:" + animationQueue.length);
				if (animationQueue.length == 0) {
					round++;
					showGameBoardToPlayer(gameBoard);
					resetMerge();
					// resetAnimation();
					unLockButtons();
					addNewItem();
					testGameOver();
				}
			}
		};
	}

	var animation = setInterval(frame, 1000 / 120);

}

function playAnimation() {
	if (animationQueue.length != 0) {
		for (var i = 0; i < animationQueue.length; i++) {
			// console.log("動畫列:" + animationQueue[i]["direction"] + ","
			// + animationQueue[i]["px"] + ","
			// + animationQueue[i]["py"] + ","
			// + animationQueue[i]["tx"] + ","
			// + animationQueue[i]["ty"]);
			movingAnimation(animationQueue[i]["direction"],
					animationQueue[i]["px"], animationQueue[i]["py"],
					animationQueue[i]["tx"], animationQueue[i]["ty"]);
		}
	} else {
		unLockButtons();
	}
	// console.log("目前動畫數量:" + animationQueue.length);
}
/** ********************** */
/** **** 上下左右按鈕事件 ***** */
function clickLeft() {
	lockButtons();
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (gameBoard[x][y]) {
				gameBoard[x][y].left();
			}
		}
	}
	playAnimation();
}

function clickRight() {
	lockButtons();
	for (var x = gameBoard.length - 1; x >= 0; x--) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (gameBoard[x][y]) {
				gameBoard[x][y].right();
			}
		}
	}
	playAnimation();
}

function clickTop() {
	lockButtons();
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (gameBoard[x][y]) {
				gameBoard[x][y].top();
			}
		}
	}
	playAnimation();
}

function clickDown() {
	lockButtons();
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = gameBoard[x].length - 1; y >= 0; y--) {
			if (gameBoard[x][y]) {
				gameBoard[x][y].down();
			}
		}
	}
	playAnimation();
}
/** ********* */

/** ****綁定按鈕點擊 && 取消綁定按鈕點擊***** */
function lockButtons() {
	var aDiv = document.getElementById("buttons");
	var btns = aDiv.getElementsByTagName("div");
	for (var i = 0; i < btns.length; i++) {
		btns[i].style.pointerEvents = 'none';
	}
}

function unLockButtons() {
	var aDiv = document.getElementById("buttons");
	var btns = aDiv.getElementsByTagName("div");
	for (var i = 0; i < btns.length; i++) {
		btns[i].style.pointerEvents = 'auto';
	}
}
/** ********* */
/** **** 判斷是否結束遊戲的方法 && 遊戲結束 && 遊戲開始***** */
function isGameOver() {
	for (var x = 0; x < gameBoard.length; x++) {
		for (var y = 0; y < gameBoard[x].length; y++) {
			if (!gameBoard[x][y]) {
				return false;
			} else {
				if (x + 1 < sizeX) {
					if (gameBoard[x + 1][y]
							&& gameBoard[x + 1][y].itemValue == gameBoard[x][y].itemValue) {
						return false;
					}
				}
				if (y + 1 < sizeY) {
					if (gameBoard[x][y + 1]
							&& gameBoard[x][y + 1].itemValue == gameBoard[x][y].itemValue) {
						return false;
					}
				}
			}
		}
	}
	return true;
}
function testGameOver() {
	if (isGameOver()) {
		gameOverPic.style.animationName = "gameOverAni";
		gameOverPic.style.display = "inline-block";
		btnLeft.style.display = "none";
		btnLeft.style.animationName = "";
		btnRight.style.display = "none";
		btnRight.style.animationName = "";
		btnTop.style.display = "none";
		btnTop.style.animationName = "";
		btnDown.style.display = "none";
		btnDown.style.animationName = "";
		showScore.classList.add("redText");
		setTimeout(function() {
			btnStart.style.display = "inline-block";
			btnStart.style.animationName = "startAni";
		}, 1500);
	}
}
function gameStart() {
	init();
	showInit();
	showScore.innerHTML = score;
	showScore.classList.remove("redText");
	showRound.innerHTML = round;
	addNewItem();
	addNewItem();
	gameOverPic.style.animationName = "";
	gameOverPic.style.display = "none";
	btnStart.style.display = "none";
	btnStart.style.animationName = "";
	btnLeft.style.display = "inline-block";
	btnLeft.style.animationName = "bornAni";
	btnLeft.style.pointerEvents = 'auto';
	btnRight.style.display = "inline-block";
	btnRight.style.animationName = "bornAni";
	btnRight.style.pointerEvents = 'auto';
	btnTop.style.display = "inline-block";
	btnTop.style.animationName = "bornAni";
	btnTop.style.pointerEvents = 'auto';
	btnDown.style.display = "inline-block";
	btnDown.style.animationName = "bornAni";
	btnDown.style.pointerEvents = 'auto';
}
/** ********* */
/** ******* 增加鍵盤控制功能 2016.12.25********* */
function onKeyDownEvent(e) {
	switch (e.keyCode) {
	case 13:// 按下enter
		if (btnStart.style.display == "inline-block") {
			btnStart.onclick();
		}
		break;
	case 38://up
		if (btnTop.style.pointerEvents == 'auto'){
			btnTop.onclick();
		}
		break;
	case 37://left
		if (btnLeft.style.pointerEvents == 'auto'){
			btnLeft.onclick();
		}
		break;
	case 40://down
		if (btnDown.style.pointerEvents == 'auto'){
			btnDown.onclick();
		}
		break;
	case 39://right
		if (btnRight.style.pointerEvents == 'auto'){
			btnRight.onclick();
		}
		break;
	}
}
/** ***************** */
