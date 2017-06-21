/**
 * Created by CodingMaster on 2017/5/19.
 */

//定義撲克牌物件
function Card(id) {
    this.id = id;
    this.number = id % 13 + 1;
    this.color = (function (id) {
        var tempColor = Math.floor(id / 13);
        switch (tempColor) {
            case 0:
                return 'S';
            case 1:
                return 'H';
            case 2:
                return 'D';
            case 3:
                return 'F'
        }
    })(id);
    this.enableMove = false;
    this.enableStack = false;
    this.isOpen = false;
    this.enableOpen = false;
    this.parentCard = null;
    this.childCard = null;
    this.belongPool = game.system.startCardPool;
    this.matchView = null;
}

Card.prototype = {
    moveToDrawCardPool: function () {
        if (this.enableMove && this.enableOpen) {
            var pool = this.belongPool;
            var targetPool = game.system.drawCardPool;
            targetPool.push(pool.pop());
        }
        updateStateAtDrawCardPool();
        updateViewAtDrawCardPool();
        updateStateAtStartCardPool();
        updateViewAtStartCardPool();
    },
    moveToGameCardPool: function (gameCardPool) {
        if (gameCardPool.length === 0) {
            if (this.number === 13) {

                var aCards = [];
                aCards.push(this);
                this.belongPool.splice(this.belongPool.indexOf(this), 1);

                var tempChild = this.childCard;
                while (tempChild != null) {
                    aCards.push(tempChild);
                    tempChild.belongPool.splice(tempChild.belongPool.indexOf(tempChild), 1);
                    tempChild = tempChild.childCard;
                }

                for (var i = 0; i < aCards.length; i++) {
                    gameCardPool.push(aCards[i]);
                }

                var originalPool = this.belongPool;
                if (originalPool === game.system.drawCardPool) {
                    updateStateAtDrawCardPool();
                    updateViewAtDrawCardPool();
                } else {
                    updateStateAtGameCardPool(originalPool);
                    updateViewAtGameCardPool(originalPool);
                }
                updateStateAtGameCardPool(gameCardPool);
                updateViewAtGameCardPool(gameCardPool);

                // console.log(originalPool);
                // console.log(gameCardPool);
            }
        } else {
            // console.log('此遊戲牌區未清空,不得進行此移動');
        }
    },
    moveToAnotherCard: function (targetCard) {
        var success = false;
        if (this.enableMove && targetCard && targetCard.enableStack) {
            switch (this.color) {
                case 'S':
                case 'F':
                    if ((targetCard.color === 'H' || targetCard.color === 'D') && (targetCard.number - 1 === this.number)) {
                        success = true;
                    }
                    break;
                case 'H':
                case 'D':
                    if ((targetCard.color === 'S' || targetCard.color === 'F') && (targetCard.number - 1 === this.number)) {
                        success = true;
                    }
                    break;
            }
            if (success) {
                // if (this.parentCard != null) {
                //     this.parentCard.childCard = null;
                // }
                // targetCard.childCard = this;
                // this.parentCard = targetCard;
                //
                // var originalPool = this.belongPool;
                // var index = this.belongPool.indexOf(this);
                // console.log(index);
                // targetCard.belongPool.push(this);
                // this.belongPool.splice(index, 1);
                // console.log(this.belongPool);
                // console.log(targetCard.belongPool);
                //
                // updateStateAtGameCardPool(originalPool);
                // updateStateAtGameCardPool(targetCard.belongPool);
                // updateViewAtGameCardPool(originalPool);
                // updateViewAtGameCardPool(targetCard.belongPool);
                //
                // if (this.childCard != null) {
                //     // alert('pause');
                //     this.childCard.moveToAnotherCard(this);
                // }
                ///////增加效能,不使用以上方法(遞迴)/////
                if (this.parentCard != null) {
                    this.parentCard.childCard = null;
                }
                targetCard.childCard = this;
                this.parentCard = targetCard;

                var aCards = [];
                aCards.push(this);
                this.belongPool.splice(this.belongPool.indexOf(this), 1);

                var tempChild = this.childCard;
                while (tempChild != null) {
                    aCards.push(tempChild);
                    tempChild.belongPool.splice(tempChild.belongPool.indexOf(tempChild), 1);
                    tempChild = tempChild.childCard;
                }

                // targetCard.belongPool = targetCard.belongPool.concat(aCards);
                for (var i = 0; i < aCards.length; i++) {
                    targetCard.belongPool.push(aCards[i]);
                }

                var originalPool = this.belongPool;
                if (originalPool === game.system.drawCardPool) {
                    updateStateAtDrawCardPool();
                    updateViewAtDrawCardPool();
                } else {
                    updateStateAtGameCardPool(originalPool);
                    updateViewAtGameCardPool(originalPool);
                }
                updateStateAtGameCardPool(targetCard.belongPool);
                updateViewAtGameCardPool(targetCard.belongPool);

                // console.log(originalPool);
                // console.log(targetCard.belongPool);

            } else {
                console.log(this.color + this.number + ' --> ' + targetCard.color + targetCard.number + ' 目標牌違規,無法移動!');
            }
        } else {
            if (!targetCard) {
                // console.log('目標牌不存在');
            } else {
                if (!this.enableMove)
                    console.log('當前牌無法移動');
                if (!targetCard.enableStack)
                    console.log('目標牌無法疊加');
            }
        }
    }
    ,
    moveToGoalCardPool: function (goalCardPool) {
        if (this.enableMove && this.childCard === null) {
            if (goalCardPool.length === 0) {
                if (this.number === 1) {
                    if (this.parentCard != null) {
                        this.parentCard.childCard = null;
                        this.parentCard = null;
                    }
                    goalCardPool.push(this);
                    this.belongPool.splice(this.belongPool.indexOf(this), 1);
                    if (this.belongPool === game.system.drawCardPool) {
                        updateStateAtDrawCardPool();
                        updateViewAtDrawCardPool();
                    } else {
                        updateStateAtGameCardPool(this.belongPool);
                        updateViewAtGameCardPool(this.belongPool);
                    }
                    updateStateAtGoalCardPool(goalCardPool);
                    updateViewAtGoalCardPool(goalCardPool);
                } else {
                    console.log('無法移動至終點區');
                }
            } else {
                var lastCard = goalCardPool[goalCardPool.length - 1];
                if (this.color === lastCard.color && this.number === lastCard.number + 1) {
                    if (this.parentCard != null) {
                        this.parentCard.childCard = null;
                        this.parentCard = null;
                    }
                    goalCardPool.push(this);
                    this.belongPool.splice(this.belongPool.indexOf(this), 1);
                    if (this.belongPool === game.system.drawCardPool) {
                        updateStateAtDrawCardPool();
                        updateViewAtDrawCardPool();
                    } else {
                        updateStateAtGameCardPool(this.belongPool);
                        updateViewAtGameCardPool(this.belongPool);
                    }
                    updateStateAtGoalCardPool(goalCardPool);
                    updateViewAtGoalCardPool(goalCardPool);
                } else {
                    console.log('無法移動至終點區');
                }
            }
        } else {
            if (!this.enableMove)
                console.log('此牌無法移動');
            if (!this.childCard)
                console.log('此牌有下牌,無法移動至終點區')
        }
    },
    //use for debug
    consoleSelf: function () {
        console.log(this);
    }
};

//遊戲整體物件
var game = {
    system: {
        //滑鼠在撲克牌上的相對位置
        x: 0,
        y: 0,
        //撲克牌
        cards: [],
        dealCardsOrder: generateDealCardsOrder(),
        //發牌區
        startCardPool: [],
        //抽牌區
        drawCardPool: [],
        //遊戲牌區 7格
        gameCardPools: (function () {
            var tempGameCardPools = [];
            for (var i = 0; i < 7; i++) {
                tempGameCardPools[i] = [];
            }
            return tempGameCardPools;
        })(),
        //目標牌區 4格
        goalCardPools: (function () {
            var tempGoalCardPools = [];
            for (var i = 0; i < 4; i++) {
                tempGoalCardPools[i] = [];
            }
            return tempGoalCardPools;
        })(),
        movingCards: [],
        lockCard: false,
        lockCardObj: null
    },
    view: {
        //遊戲場景 三處
        startZoneDiv: null,
        gameZoneDiv: null,
        goalZoneDiv: null,
        //startZone
        startCardPoolDiv: null,
        drawCardPoolDiv: null,
        //gameZone
        gameCardPoolDivs: [],
        //goalZone
        goalCardPoolDivs: [],
        //移動DIV
        movingCardDiv: null,
        //撲克牌 52張
        cardDivs: []
    }
};

//非物件方法
//遊戲初始化
var initialGameForSystem = {
    step1: function () {
        //創建撲克牌
        for (var i = 0; i < 52; i++) {
            var tempCard = new Card(i);
            tempCard.matchView = game.view.cardDivs[i];
            game.system.cards.push(tempCard);
        }
        console.log('創建撲克牌完畢!');
    },
    step2: function () {
        //發牌
        var cloneCardsOrder = game.system.dealCardsOrder.slice(0);
        for (var i = 0; i < 52; i++) {
            var number = cloneCardsOrder.shift();
            if (i < 1) {
                game.system.gameCardPools[0].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[0];
                // game.system.cards[number].moveToGameCardPool(game.system.gameCardPools[0]);
            } else if (i >= 1 && i < 3) {
                game.system.gameCardPools[1].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[1];
            } else if (i >= 3 && i < 6) {
                game.system.gameCardPools[2].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[2];
            } else if (i >= 6 && i < 10) {
                game.system.gameCardPools[3].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[3];
            } else if (i >= 10 && i < 15) {
                game.system.gameCardPools[4].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[4];
            } else if (i >= 15 && i < 21) {
                game.system.gameCardPools[5].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[5];
            } else if (i >= 21 && i < 28) {
                game.system.gameCardPools[6].push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.gameCardPools[6];
            } else {
                game.system.startCardPool.push(game.system.cards[number]);
                // game.system.cards[number].belongPool = game.system.startCardPool;
                //game.system.cards[number].enableTurnOver = true;
            }
        }
        console.log('發牌完畢!');
        updateStateAtStartCardPool();
        updateStateAtGameCardPools();
    }
};

var initialGameForView = {
    step1: function () {
        //創建場景 和 放牌區
        var body = document.getElementsByClassName('innerBody')[0];

        game.view.startZoneDiv = document.createElement('div');
        game.view.startZoneDiv.classList.add('startScene');
        body.appendChild(game.view.startZoneDiv);

        game.view.gameZoneDiv = document.createElement('div');
        game.view.gameZoneDiv.classList.add('gameScene');
        body.appendChild(game.view.gameZoneDiv);

        game.view.goalZoneDiv = document.createElement('div');
        game.view.goalZoneDiv.classList.add('goalScene');
        body.appendChild(game.view.goalZoneDiv);

        game.view.startCardPoolDiv = document.createElement('div');
        game.view.startCardPoolDiv.classList.add('cardWrap');
        game.view.startCardPoolDiv.classList.add('start');
        game.view.startZoneDiv.appendChild(game.view.startCardPoolDiv);

        game.view.drawCardPoolDiv = document.createElement('div');
        game.view.drawCardPoolDiv.classList.add('cardWrap');
        game.view.drawCardPoolDiv.classList.add('draw');
        game.view.startZoneDiv.appendChild(game.view.drawCardPoolDiv);

        for (var i = 0; i < 7; i++) {
            game.view.gameCardPoolDivs[i] = document.createElement('div');
            game.view.gameCardPoolDivs[i].classList.add('cardWrap');
            game.view.gameCardPoolDivs[i].classList.add('game');
            game.view.gameZoneDiv.appendChild(game.view.gameCardPoolDivs[i]);
        }

        for (var i = 0; i < 4; i++) {
            game.view.goalCardPoolDivs[i] = document.createElement('div');
            game.view.goalCardPoolDivs[i].classList.add('cardWrap');
            game.view.goalCardPoolDivs[i].classList.add('goal');
            game.view.goalZoneDiv.appendChild(game.view.goalCardPoolDivs[i]);
        }

        //創建52張撲克牌VIEW
        for (var i = 0; i < 52; i++) {
            game.view.cardDivs[i] = document.createElement('div');
            game.view.cardDivs[i].classList.add('card');
            // game.view.cardDivs[i].style.backgroundImage = 'url("resource/image/b.png")';
        }

        //創建移動撲克牌
        game.view.movingCardDiv = document.createElement('div');
        game.view.movingCardDiv.classList.add('card');
        game.view.movingCardDiv.classList.add('moving');
        document.body.appendChild(game.view.movingCardDiv);
    },
    step2: function () {
        updateViewAtStartCardPool();
        updateViewAtGameCardPools();
    },
    step3: function () {
        //註冊監聽器
        game.view.startCardPoolDiv.addEventListener('click', onClickForStartDiv);

        for (var i = 0; i < game.system.cards.length; i++) {
            game.system.cards[i].matchView.addEventListener('click', onClickForCardDiv);
            // game.system.cards[i].matchView.addEventListener('mouseover', onMouseOverForCardDiv);
            game.system.cards[i].matchView.addEventListener('mouseleave', onMouseLeaveForCardDiv);
            game.system.cards[i].matchView.addEventListener('mousedown', onMouseDownForCardDiv);
            game.system.cards[i].matchView.addEventListener('mouseup', onMouseUpForCardDiv);
            game.system.cards[i].matchView.addEventListener('mousemove', onMouseOverForCardDiv);
        }

        for (var j = 0; j < game.view.goalCardPoolDivs.length; j++) {
            game.view.goalCardPoolDivs[j].addEventListener('mouseup', onMouseUpForGoalDiv);
        }

        for (var k = 0; k < game.view.gameCardPoolDivs.length; k++) {
            game.view.gameCardPoolDivs[k].addEventListener('mouseup', onMouseUpForGameDiv);
        }

        document.addEventListener('mouseup', onMouseUpForBody);
        document.addEventListener('mousemove', onMouseMoveForBody);
    },
    step4:function () {
        //新增功能鍵
        var resetBtn = document.createElement('input');
        resetBtn.type = 'button';
        resetBtn.value = 'reset';
        resetBtn.addEventListener('click',reset);
        resetBtn.style.position = 'absolute';
        resetBtn.style.right = 0;
        resetBtn.style.bottom = 0;
        game.view.goalZoneDiv.appendChild(resetBtn);
    }
};

function generateDealCardsOrder() {
    //發牌亂數序列
    var randomNumbers = [];
    var tempRandomNumber = null;
    var pushFlag = null;
    for (var i = 0; i < 52; i++) {
        tempRandomNumber = parseInt(Math.random() * 52);
        pushFlag = true;
        for (var j = 0; j < randomNumbers.length; j++) {
            if (randomNumbers[j] === tempRandomNumber) {
                pushFlag = false;
                break;
            }
        }
        if (pushFlag) {
            randomNumbers.push(tempRandomNumber);
        } else {
            i--
        }
    }
    // console.log(randomNumbers);
    return randomNumbers;
}

//更新視圖
function updateViewAtStartCardPool() {
    var pool = game.system.startCardPool;
    var div = game.view.startCardPoolDiv;
    for (var i = 0; i < pool.length; i++) {
        pool[i].matchView.style.visibility = 'visible';
        pool[i].matchView.style.top = 0;
        div.appendChild(pool[i].matchView);
    }
    updateCardsPng(pool);
    // console.log('發牌區視圖更新完畢!');
}
function updateViewAtDrawCardPool() {
    var pool = game.system.drawCardPool;
    var div = game.view.drawCardPoolDiv;
    for (var i = 0; i < pool.length; i++) {
        div.appendChild(pool[i].matchView);
        if (i < pool.length - 3) {
            pool[i].matchView.style.visibility = 'hidden';
        } else {
            switch (pool.length) {
                case 1:
                    pool[i].matchView.style.visibility = 'visible';
                    pool[i].matchView.style.top = (i - pool.length + 1) * 25 + '%';
                    break;
                case 2:
                    pool[i].matchView.style.visibility = 'visible';
                    pool[i].matchView.style.top = (i - pool.length + 2) * 25 + '%';
                    break;
                default:
                    pool[i].matchView.style.visibility = 'visible';
                    pool[i].matchView.style.top = (i - pool.length + 3) * 25 + '%';
                    break;
            }
        }
    }
    updateCardsPng(pool);
    // console.log('抽牌區視圖更新完畢!');
}
function updateViewAtGameCardPool(gameCardPool) {
    var pool = gameCardPool;
    var div = getGameDivFromPool(gameCardPool);
    for (var i = 0; i < pool.length; i++) {
        pool[i].matchView.style.top = i * 25 + '%';
        div.appendChild(pool[i].matchView);
    }
    updateCardsPng(gameCardPool);
    //log
    var pools = game.system.gameCardPools;
    for (var j = 0; j < pools.length; j++) {
        if (pools[j] === gameCardPool) {
            // console.log('第 ' + j + ' 遊戲區視圖更新完畢!');
        }
    }
}
function updateViewAtGameCardPools() {
    for (var i = 0; i < game.system.gameCardPools.length; i++) {
        updateViewAtGameCardPool(game.system.gameCardPools[i]);
    }
    // console.log('所有遊戲區視圖更新完畢!');
}

function updateViewAtGoalCardPool(goalCardPool) {
    var pool = goalCardPool;
    var div = getGoalDivFromPool(goalCardPool);

    for (var i = 0; i < pool.length; i++) {
        pool[i].matchView.style.top = 0;
        div.appendChild(pool[i].matchView);
    }

    updateCardsPng(goalCardPool);
    isWin();
    //log
    var pools = game.system.goalCardPools;
    for (var j = 0; j < pools.length; j++) {
        if (pools[j] === goalCardPool) {
            // console.log('第 ' + j + ' 終點區視圖更新完畢!');
        }
    }
}

function updateCardsPng(cards) {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].isOpen) {
            cards[i].matchView.style.backgroundImage = 'url("resource/image/' + cards[i].id + '.png")';
        } else {
            cards[i].matchView.style.backgroundImage = 'url("resource/image/b.png")';
            // cards[i].matchView.style.backgroundImage = 'url("resource/image/' + cards[i].id + '.png")';
        }
    }
}

function updateViewAtMovingCards() {
    var cards = game.system.movingCards;
    var div = game.view.movingCardDiv;

    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }

    for (var i = 0; i < cards.length; i++) {
        var tempDiv = cards[i].matchView.cloneNode(false);
        tempDiv.style.top = i * 25 + '%';
        tempDiv.style.pointerEvents = 'none';
        div.appendChild(tempDiv);
    }
}
//更新狀態
function updateStateAtStartCardPool() {
    var pool = game.system.startCardPool;
    for (var i = 0; i < pool.length; i++) {
        pool[i].enableOpen = true;
        pool[i].enableMove = true;
        pool[i].isOpen = false;
        pool[i].belongPool = pool;
    }
    // console.log('發牌區狀態更新完畢!');
}
function updateStateAtDrawCardPool() {
    var pool = game.system.drawCardPool;
    for (var i = 0; i < pool.length; i++) {
        pool[i].belongPool = game.system.drawCardPool;
        pool[i].isOpen = true;
        pool[i].enableMove = false;
        if (i === (pool.length - 1)) {
            pool[i].enableMove = true;
        }
    }
    // console.log('抽牌區狀態更新完畢');
}
function updateStateAtGameCardPool(gameCardPool) {
    var pool = gameCardPool;
    for (var i = 0; i < pool.length; i++) {
        pool[i].belongPool = gameCardPool;
        pool[i].enableStack = false;
        if (i === (pool.length - 1)) {
            pool[i].enableMove = true;
            pool[i].enableStack = true;
            if (pool[i].isOpen === false) {
                pool[i].isOpen = true;
            }
        }
    }
    //log
    var pools = game.system.gameCardPools;
    for (var j = 0; j < pools.length; j++) {
        if (pools[j] === gameCardPool) {
            // console.log('第 ' + j + ' 遊戲區狀態更新完畢!');
        }
    }

}
function updateStateAtGameCardPools() {
    for (var i = 0; i < game.system.gameCardPools.length; i++) {
        updateStateAtGameCardPool(game.system.gameCardPools[i]);
    }
    // console.log('所有遊戲區狀態更新完畢!');
}

function updateStateAtGoalCardPool(goalCardPool) {
    var pool = goalCardPool;
    for (var i = 0; i < pool.length; i++) {
        pool[i].enableMove = false;
        pool[i].enableStack = true;
        pool[i].belongPool = goalCardPool;
    }
    //log
    var pools = game.system.goalCardPools;
    for (var j = 0; j < pools.length; j++) {
        if (pools[j] === goalCardPool) {
            // console.log('第 ' + j + ' 終點區狀態更新完畢!');
        }
    }
}
//視圖監聽器方法集
function onClickForStartDiv() {
    while (game.system.drawCardPool.length != 0) {
        game.system.startCardPool.push(game.system.drawCardPool.pop());
    }
    updateStateAtStartCardPool();
    updateViewAtStartCardPool();
    updateStateAtDrawCardPool();
    updateViewAtDrawCardPool();
}
function onClickForCardDiv(e) {
    // console.log('點擊事件觸發,');
    var div = e.target;
    var card = getCardFromDiv(div);
    var pool = card.belongPool;
    // console.log(pool);
    if (pool === game.system.startCardPool) {
        // console.log('該事件屬於 發牌區 事件,');
        // console.log(card.color + card.number + ' 從 發牌區 移動至 抽牌區');
        card.moveToDrawCardPool();
    } else {
        // console.log('無任何事情發生');
    }
    e.stopPropagation();
}
function onMouseOverForCardDiv(e) {
    var div = e.target;
    var card = getCardFromDiv(div);
    var pool = card.belongPool;
    var movingCards = game.system.movingCards;
    var lock = game.system.lockCard;
    if (!lock) {
        if (card.enableMove && (pool === game.system.drawCardPool || isGameCardPoolsElement(pool))) {

            movingCards.splice(0, movingCards.length);

            movingCards.push(card);

            var tempChild = card.childCard;
            while (tempChild != null) {
                movingCards.push(tempChild);
                tempChild = tempChild.childCard;
            }

            updateViewAtMovingCards();

        } else {
            // console.log('此牌無法移動');
        }
    } else {
        if (game.system.lockCardObj.matchView.style.visibility !== 'hidden') {
            game.system.lockCardObj.matchView.style.visibility = 'hidden';
            var tempChild = game.system.lockCardObj.childCard;
            while (tempChild != null) {
                tempChild.matchView.style.visibility = 'hidden';
                tempChild = tempChild.childCard;
            }
        }
    }

    // e.stopPropagation();
}

function onMouseLeaveForCardDiv(e) {
    var lock = game.system.lockCard;
    var movingCards = game.system.movingCards;
    if (!lock) {
        movingCards.splice(0, movingCards.length);
        updateViewAtMovingCards();
    }
    e.stopPropagation();
}

function onMouseDownForCardDiv(e) {
    // console.log('down');

    var div = e.target;
    var card = getCardFromDiv(div);

    if (card.enableMove && card.belongPool != game.system.startCardPool) {
        game.system.lockCard = true;
        game.system.lockCardObj = card;
        game.system.x = e.clientX - getPositionX(div);
        game.system.y = e.clientY - getPositionY(div);
        // console.log('lockCardObj: ' + game.system.lockCardObj.color + game.system.lockCardObj.number);
    }

    e.preventDefault();
}
function onMouseUpForCardDiv(e) {
    // console.log('up');

    var div = e.target;
    var card = getCardFromDiv(div);
    var lock = game.system.lockCard;
    if (lock) {
        if (game.system.lockCardObj != card) {
            if (isGameCardPoolsElement(card.belongPool)) {
                game.system.lockCardObj.moveToAnotherCard(card);
            } else if (isGoalCardPoolsElement(card.belongPool)) {
                game.system.lockCardObj.moveToGoalCardPool(card.belongPool);
            }
        } else {
            // console.log('兩牌相等,不處理事件');
        }
    } else {
        // console.log('未選擇牌,不處理事件');
    }

    if (game.system.lockCardObj != null && game.system.lockCardObj.matchView.style.visibility === 'hidden') {
        game.system.lockCardObj.matchView.style.visibility = 'visible';
        var tempChild = game.system.lockCardObj.childCard;
        while (tempChild != null) {
            tempChild.matchView.style.visibility = 'visible';
            tempChild = tempChild.childCard;
        }
    }
    game.system.lockCard = false;
    game.system.lockCardObj = null;
    game.view.movingCardDiv.style.display = 'none';
    game.view.movingCardDiv.style.left = 0;
    game.view.movingCardDiv.style.top = 0;
    var movingCards = game.system.movingCards;
    movingCards.splice(0, movingCards.length);
    e.preventDefault();
    e.stopPropagation();
}
function onMouseUpForGoalDiv(e) {
    var div = e.target;
    var goal = getGoalFromDiv(div);
    var card = game.system.lockCardObj;
    var lock = game.system.lockCard;
    if (lock) {
        card.moveToGoalCardPool(goal);
    } else {
        // console.log('未選擇牌,不處理事件');
    }


    if (game.system.lockCardObj != null && game.system.lockCardObj.matchView.style.visibility === 'hidden') {
        game.system.lockCardObj.matchView.style.visibility = 'visible';
        var tempChild = game.system.lockCardObj.childCard;
        while (tempChild != null) {
            tempChild.matchView.style.visibility = 'visible';
            tempChild = tempChild.childCard;
        }
    }
    // console.log('up');
    game.system.lockCard = false;
    game.system.lockCardObj = null;
    game.view.movingCardDiv.style.display = 'none';
    game.view.movingCardDiv.style.left = 0;
    game.view.movingCardDiv.style.top = 0;
    var movingCards = game.system.movingCards;
    movingCards.splice(0, movingCards.length);
    updateViewAtMovingCards();
    e.preventDefault();
    e.stopPropagation();
}

function onMouseUpForGameDiv(e) {
    var div = e.target;
    var gamePool = getGameFromDiv(div);
    var card = game.system.lockCardObj;
    var lock = game.system.lockCard;
    if (lock) {
        card.moveToGameCardPool(gamePool);
    } else {
        // console.log('未選擇牌,不處理事件');
    }

    if (game.system.lockCardObj != null && game.system.lockCardObj.matchView.style.visibility === 'hidden') {
        game.system.lockCardObj.matchView.style.visibility = 'visible';
        var tempChild = game.system.lockCardObj.childCard;
        while (tempChild != null) {
            tempChild.matchView.style.visibility = 'visible';
            tempChild = tempChild.childCard;
        }
    }
    // console.log('up');
    game.system.lockCard = false;
    game.system.lockCardObj = null;
    game.view.movingCardDiv.style.display = 'none';
    game.view.movingCardDiv.style.left = 0;
    game.view.movingCardDiv.style.top = 0;
    var movingCards = game.system.movingCards;
    movingCards.splice(0, movingCards.length);
    updateViewAtMovingCards();
    e.preventDefault();
    e.stopPropagation();
}

function onMouseUpForBody(e) {
    // console.log('up');
    if (game.system.lockCardObj != null && game.system.lockCardObj.matchView.style.visibility === 'hidden') {
        game.system.lockCardObj.matchView.style.visibility = 'visible';
        var tempChild = game.system.lockCardObj.childCard;
        while (tempChild != null) {
            tempChild.matchView.style.visibility = 'visible';
            tempChild = tempChild.childCard;
        }
    }
    game.system.lockCard = false;
    game.system.lockCardObj = null;
    game.view.movingCardDiv.style.display = 'none';
    game.view.movingCardDiv.style.left = 0;
    game.view.movingCardDiv.style.top = 0;
    var movingCards = game.system.movingCards;
    movingCards.splice(0, movingCards.length);
    updateViewAtMovingCards();
    e.preventDefault();
    e.stopPropagation();
}
function onMouseMoveForBody(e) {
    var lock = game.system.lockCard;
    // console.log(e.clientX+"||"+e.clientY);
    if (lock) {
        game.view.movingCardDiv.style.display = 'inline-block';
        game.view.movingCardDiv.style.left = e.clientX - game.system.x + 'px';
        game.view.movingCardDiv.style.top = e.clientY - game.system.y + 'px';
    }
}


//工具類
function getCardFromDiv(divElement) {
    for (var z = 0; game.system.cards.length; z++) {
        if (game.system.cards[z].matchView === divElement) {
            return game.system.cards[z];
        }
    }
    return null;
}
function getGameDivFromPool(gameCardPool) {
    for (var i = 0; i < game.system.gameCardPools.length; i++) {
        if (game.system.gameCardPools[i] === gameCardPool) {
            return game.view.gameCardPoolDivs[i];
        }
    }
    return null;
}
function getGoalDivFromPool(goalCardPool) {
    for (var i = 0; i < game.system.goalCardPools.length; i++) {
        if (game.system.goalCardPools[i] === goalCardPool) {
            return game.view.goalCardPoolDivs[i];
        }
    }
    return null;
}
function getGoalFromDiv(goalPoolDiv) {
    var poolDivs = game.view.goalCardPoolDivs;
    for (var i = 0; i < poolDivs.length; i++) {
        if (goalPoolDiv === poolDivs[i]) {
            return game.system.goalCardPools[i];
        }
    }
    return null;
}
function getGameFromDiv(gamePoolDiv) {
    var poolDivs = game.view.gameCardPoolDivs;
    for (var i = 0; i < poolDivs.length; i++) {
        if (gamePoolDiv === poolDivs[i]) {
            return game.system.gameCardPools[i];
        }
    }
    return null;
}
function isGameCardPoolsElement(pool) {
    for (var i = 0; i < game.system.gameCardPools.length; i++) {
        if (pool === game.system.gameCardPools[i]) {
            return true;
        }
    }
    return false;
}
function isGoalCardPoolsElement(pool) {
    for (var i = 0; i < game.system.goalCardPools.length; i++) {
        if (pool === game.system.goalCardPools[i]) {
            return true;
        }
    }
    return false;
}
function getPositionX(element) {
    var tempX = 0;
    var level = 0;
    while (level < 3) {
        tempX += element.offsetLeft;
        element = element.parentElement;
        level++;
    }
    return tempX;
}

function getPositionY(element) {
    var tempY = 0;
    var level = 0;
    while (level < 3) {
        tempY += element.offsetTop;
        element = element.parentElement;
        level++;
    }
    return tempY;
}
function forceUpdateView() {
    void document.body.offsetHeight;
}
///
function isWin() {
    var comNum = 0;
    var pools = game.system.goalCardPools;
    for (var i = 0; i < pools.length; i++) {
        comNum += pools[i].length;
    }
    console.log('已完成張數: '+comNum);
    if(comNum === 52){
        alert('You Win!');
    }
}
function reset(){
    var scene = document.getElementsByClassName('innerBody')[0];
    while(scene.hasChildNodes()){
        scene.removeChild(scene.lastChild);
    }
    game = {
        system: {
            //滑鼠在撲克牌上的相對位置
            x: 0,
            y: 0,
            //撲克牌
            cards: [],
            dealCardsOrder: generateDealCardsOrder(),
            //發牌區
            startCardPool: [],
            //抽牌區
            drawCardPool: [],
            //遊戲牌區 7格
            gameCardPools: (function () {
                var tempGameCardPools = [];
                for (var i = 0; i < 7; i++) {
                    tempGameCardPools[i] = [];
                }
                return tempGameCardPools;
            })(),
            //目標牌區 4格
            goalCardPools: (function () {
                var tempGoalCardPools = [];
                for (var i = 0; i < 4; i++) {
                    tempGoalCardPools[i] = [];
                }
                return tempGoalCardPools;
            })(),
            movingCards: [],
            lockCard: false,
            lockCardObj: null
        },
        view: {
            //遊戲場景 三處
            startZoneDiv: null,
            gameZoneDiv: null,
            goalZoneDiv: null,
            //startZone
            startCardPoolDiv: null,
            drawCardPoolDiv: null,
            //gameZone
            gameCardPoolDivs: [],
            //goalZone
            goalCardPoolDivs: [],
            //移動DIV
            movingCardDiv: null,
            //撲克牌 52張
            cardDivs: []
        }
    };
    initialGameForView.step1();
    initialGameForSystem.step1();
    initialGameForSystem.step2();
    initialGameForView.step2();
    initialGameForView.step3();
    initialGameForView.step4();
}
///
//log function
function showCardsState() {
    for (var i = 0; i < game.system.cards.length; i++) {
        game.system.cards[i].consoleSelf();
    }
}
function showDealCardsOrder() {
    console.log(game.system.dealCardsOrder);
}
function showGameCardPools() {
    for (var i = 0; i < game.system.gameCardPools.length; i++) {
        console.log(game.system.gameCardPools[i]);
    }
}
function showStartCardPools() {
    console.log(game.system.startCardPool);
}
//////////////////////
window.addEventListener('load', function () {
    console.log('頁面載入完成');
    initialGameForView.step1();
    initialGameForSystem.step1();
    initialGameForSystem.step2();
    initialGameForView.step2();
    initialGameForView.step3();
    initialGameForView.step4();

    // showCardsState();
    // showDealCardsOrder();
    // showGameCardPools();
    // showStartCardPools();
});


window.addEventListener('resize', function () {
    console.log(document.documentElement.clientWidth);
});


