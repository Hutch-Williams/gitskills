function  showNumWithAnimation(randx,randy,ranNumber){
    var numberCell = $('#number-cell-' + randx + '-' +randy);

    numberCell.css('background-color',getNumBackgroundColor(ranNumber));
    numberCell.css('color',getNumColor(ranNumber));
    numberCell.text(ranNumber);

    numberCell.animate({
        width:'100px',
        height:'100px',
        top:getPosTop(randx,randy),
        left:getPosLeft(randx,randy)
    },50);  
}

function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell = $('#number-cell-'+ fromx + '-' + fromy);

    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updateScore( score ){
    $('#score').text( score)
}