var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    //为移动端初始化网页内容为百分比
    prepareForMobile();
    newgame();
});

function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function prepareForMobile() { //这里是将grid-cell和grid-cotainer的css样式都修改为百分比大小
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }

    $('#grid-container').css('width', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2 * cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function init() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {

            var gridCell = $('#grid-cell-' + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false; //在初始化时将hasConflicted[i][j]的值设为false
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView() {

    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);//修改对应的绝对定位方位
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);//修改对应的绝对定位方位
            }
            else {
                theNumberCell.css('width', cellSideLength); //将number-cell修改成适配移动端的
                theNumberCell.css('height', cellSideLength);//将number-cell修改成适配移动端的
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    $('.number-cell').css('line-height', cellSideLength + 'px'); //此三行为修改number-cell的css值
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
    $('.number-cell').css('border-radius', 0.02 * cellSideLength + 'px');

}

function generateOneNumber() {

    if (nospace(board))
        return false;

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0)
            break;

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times++
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumWithAnimation(randx, randy, randNumber);

    return true;
}

    $(document).keydown(function (event) {
        //因为会影响其他事件，所以将其注释掉了event.preventDefault(); 
        //如果将这个代码直接写在前面，最先执行的话，可能会有很多其他的功能也无法正常使用
        switch (event.keyCode) {
            case 37: //left
                event.preventDefault(); 
                if (moveLeft()) {
                    setTimeout("generateOneNumber()", 210);
                    setTimeout("isgameover()", 300);
                }
                break;
            case 38: //up
                event.preventDefault(); 
                if (moveUp()) {
                    setTimeout("generateOneNumber()", 210);
                    setTimeout("isgameover()", 300);
                }
                break;
            case 39: //right
                event.preventDefault(); 
                if (moveRight()) {
                    setTimeout("generateOneNumber()", 210);
                    setTimeout("isgameover()", 300);
                }
                break;
            case 40: //down
                event.preventDefault(); 
                if (moveDown()) {
                    setTimeout("generateOneNumber()", 210);
                    setTimeout("isgameover()", 300);
                }
                break;
            default: //default
                break;
        }
    });

document.addEventListener('touchstart',function(event){
    startx = event.touches[0].pageX;//touches 当前位于屏幕上的所有手指的列表()
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault(); //在touchmove事件触发时我们将其的默认功能取消掉
});

document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;//changedTouches涉及当前事件手指的列表(也就是进行改变时)
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx ; //在触摸结束后，获取x方向的向量值
    var deltay = endy - starty ; //在触摸结束后，获取y方向的向量值

    if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth){
        return; //判断，x和y坐标轴的向量都小于设备宽度的0.3倍时，我们将这个函数直接return回去不进行任何操作
    }

    if (Math.abs(deltax) >= Math.abs(deltay) ){//判断绝对值大小
        //x方向移动
        if (deltax > 0 ){
            //moveright
            if (moveRight() ){//当x方向向量值大于0时
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            } 
        }
        else {
            //moveleft
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
        
    }
    else {//y方向移动
        if (deltay > 0){//当y方向向量值大于0时
            //movedown
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
        else{
            //moveup
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
});



function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('gameover!');
}

function moveLeft() {

    if (!canMoveLeft(board))
        return false;

    //moveLeft
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {

                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score 
                        score += board[i][k];
                        updateScore(score);

                        //change hasConflicted value
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;

    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {

                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        //change hasConflicted value
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {

    if (!canMoveUp(board))
        return false;

    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {

                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        //change hasConflicted value
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;

    //moveDown
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {

                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        //change hasConflicted value
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}
