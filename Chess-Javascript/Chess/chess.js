//lower case - black upper case - white

let currentTurn = 'white'; 
let move_count = 0;
let fiftyMoveDrawCount = 0;
let pieceCount = 32;
let move = [];//storing one line of move
let moves = [];// storing all the moves
let check = false;//storing status of king check
let whiteTimer = 0;
let blackTimer = 0;
let whiteTimeLeft = 0;
let blackTimeLeft = 0;
const game = document.querySelector('.game');
const chessboard = document.querySelector('.chessboard');
const moveStore = document.body.querySelector('.move-store');
const gameResultBox = document.body.querySelector('.game-result');
const gameResult = document.body.querySelector('.result');
const closeIcon = document.body.querySelector('close-icon');
const resultText = gameResult.querySelectorAll('p');
const whiteTime = document.body.querySelector('.time-player-white');
const blackTime = document.body.querySelector('.time-player-black');
const initialBoard = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
];

const pieceSymbols = {
    "br": "♜", "bn": "♞", "bb": "♝", "bq": "♛", "bk": "♚", "bp": "♟",
    "wR": "♖", "wN": "♘", "wB": "♗", "wQ": "♕", "wK": "♔", "wP": "♙"
};


function setBoard(){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.id = `${String.fromCharCode(97 + j)}${8 - i}`; //id = board notation
            square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            const piece = initialBoard[i][j];
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece'); // storing it as a piece
                pieceElement.classList.add(piece); // storing the name of piece
                if(piece[1].toLowerCase() == 'r' || piece[1].toLowerCase() == 'k'){
                    pieceElement.classList.add('castle');
                } 
                pieceElement.innerText = pieceSymbols[piece];
                pieceElement.setAttribute('draggable', true);
                //disabling the movement of opposite side pieces
                if(piece.startsWith('b')){
                    pieceElement.classList.add('disabled');
                }
                square.appendChild(pieceElement);
            }
    
            chessboard.appendChild(square);
        }
    }
}
setBoard();
//setting the lower part of the board according to current users piece colour
if (window.user_current.colour === 'black') {
    chessboard.classList.add('flip');
    const squares = chessboard.querySelectorAll('.piece');
    squares.forEach(square =>{
        square.classList.add('flip');
    });
    flipBoard()
}

function flipBoard(){
    const gameContainer = document.querySelector('.game');
    gameContainer.classList.add('flip-board');
    }
function timeSelection(e){
    return new Promise((resolve) =>{
        if(e.target.id == '1-min') resolve ('1');
        else if(e.target.id == '3-min') resolve ('3');
        else if(e.target.id == '5-min') resolve ('5');
        else if(e.target.id == '10-min') resolve ('10');
    });
}

function newGame(e){
    return new Promise((resolve) => {
        if(e.target.id == 'new-game') resolve(true);
    });
}

async function timeControl(e) {
     let time = await timeSelection(e);
    if (time) {
        whiteTimeLeft = blackTimeLeft = parseInt(time) * 60;
        updateTimer();
        document.addEventListener('click', newGameControl, { once: true });
    }
}
document.addEventListener('click' , timeControl);
async function newGameControl(e) {
    console.log('entered');
    let newgame = await newGame(e);
	console.log(newgame);
    if (newgame) {
        console.log("New game started");
        document.body.querySelector('.game').style.pointerEvents = 'auto';
        inititalTimer();
    }
}

function updateTimer(){
    whiteTime.innerHTML = `${Math.floor(whiteTimeLeft / 60)}:${('0' + (whiteTimeLeft % 60)).slice(-2)}`;
    blackTime.innerHTML = `${Math.floor(blackTimeLeft / 60)}:${('0' + (blackTimeLeft % 60)).slice(-2)}`;
}
function inititalTimer(){
    whiteTimer = setInterval(() => {
        if(whiteTimeLeft > 0){
            whiteTimeLeft--;
            updateTimer();
        }
        if(whiteTimeLeft == 0){
            clearInterval(whiteTimer);
            gameMessage('b','Timeout','Timeout');
        }
    },1000);
}

function timer(){//swapping as we start the timer as soon as he chooses the time button
    if(currentTurn == 'black'){
        clearInterval(blackTimer);
        whiteTimer = setInterval(() => {
            if(whiteTimeLeft > 0){
                whiteTimeLeft--;
                updateTimer();
            }
            if(whiteTimeLeft == 0){
                clearInterval(whiteTimer);
                gameMessage('b','Timeout','Timeout');
            }
        },1000);
    }
    else{
        clearInterval(whiteTimer);
        blackTimer = setInterval(() => {
            if(blackTimeLeft > 0){
                blackTimeLeft--;
                updateTimer();
            }
            if(blackTimeLeft == 0){
                clearInterval(blackTimer);
                gameMessage('w','Timeout','Timeout');
            }
        },1000);
    }
}
let draggedPiece = null; // storing the dragged piece
function dragStartHandler(e) {
    if (e.target.classList.contains('piece') && !e.target.classList.contains('disabled')) {
        draggedPiece = e.target;
    }
};

function dragOverHandler(e){
    e.preventDefault(); 
};

function dropHandler(e){
    e.preventDefault();
    // finding target square
    if (move_count == 0) clearInterval(whiteTimer);
    let target = e.target;
    while (target && !target.classList.contains('square')) {
        target = target.parentElement;
    }
    let piece_selected = draggedPiece.classList[1];//storing piece selected
    let initialPosition = draggedPiece.parentNode.id;//storing starting position of piece
    let finalPosition = target.id;// storing final position of piecelet king;
    let king;
    let kingOpp;
    if (piece_selected[0] == 'w'){
        king = document.body.querySelector('.wK');
        kingOpp = document.body.querySelector('.bk');
    }
    else{
        king = document.body.querySelector('.bk');
        kingOpp = document.body.querySelector('.wK');
    }    let kingInitial = king.parentNode.id;
    timer();
    if (isValid(piece_selected,initialPosition,finalPosition,target,draggedPiece,false) && draggedPiece) {
        const existingPiece = target.querySelector('.piece');
        // checking for empty square or opp square
        if (!existingPiece || (draggedPiece.classList[1] !== existingPiece.classList[1])) {
            if(existingPiece){
                if((draggedPiece.classList[1][0] !== existingPiece.classList[1][0])){
                    target.appendChild(draggedPiece); 
                    if((target.id[1] == 8 || target.id[1] == 1) && draggedPiece.classList[1][1].toLowerCase() == 'p'){
                        handlePromotion(piece_selected[0],target);
                        target.removeChild(draggedPiece);
                    }
                    // changing the position of the piece according to move
                    draggedPiece = null; // resetting piece
                    currentTurn = currentTurn === 'white' ? 'black' : 'white';
                }
            }
            else{
                target.appendChild(draggedPiece); 
                if((target.id[1] == 8 || target.id[1] == 1) && draggedPiece.classList[1][1].toLowerCase() == 'p'){         
                    handlePromotion(piece_selected[0],target);
                    target.removeChild(draggedPiece);
                }
                // changing the position of the piece according to move
                draggedPiece = null; // resetting piece
                currentTurn = currentTurn === 'white' ? 'black' : 'white'
            }
            let gamestatus = gameStatus(piece_selected);

            let temp;
            let currentPieceCount = document.body.querySelectorAll('.piece').length;
            let kingFinal = king.parentNode.id;
            let check = handleCheck(kingOpp.classList[1],null,kingOpp.parentNode.id,kingOpp.parentNode.id,kingOpp);
            if (gamestatus == 'checkmate') temp = piece_selected + finalPosition + '#';
            else if(Math.abs(kingInitial[0].charCodeAt(0) - kingFinal[0].charCodeAt(0)) == 2){
                if (kingFinal[0] == 'g') temp = 'O-O';
                else temp = 'O-O-O';
            }
            else if (!check) temp = piece_selected + finalPosition + '+';
            else if(currentPieceCount == pieceCount) temp = piece_selected + finalPosition;
            else if(currentPieceCount == (pieceCount - 1)){
                if (!check){
                    if (!piece_selected[1].toLowerCase == 'p') temp = piece_selected + 'x' + finalPosition + '+';
                    else temp = piece_selected +initialPosition[0] + 'x' + finalPosition + '+';
                }
                else {
                    if (!piece_selected[1].toLowerCase == 'p') temp = piece_selected + 'x' + finalPosition;
                    else temp = piece_selected +initialPosition[0] + 'x' + finalPosition;
                }
            }

            if(move_count == 0){
                const moveElement = document.createElement('div');
                moveElement.innerHTML = '1.';
                moveStore.appendChild(moveElement);
            }
            else if(move_count % 2 == 0){
                const moveElement = document.createElement('div');
                moveElement.innerHTML = (move_count/2) + 1 + '.';
                moveStore.appendChild(moveElement);
            }
            move_count++;
            const moveElement = document.createElement('div');
            moveElement.innerHTML = storeMoves(temp);
            moves.push(moveElement.innerHTML);
            moveStore.appendChild(moveElement);

            if(currentPieceCount == pieceCount && piece_selected[1].toLowerCase() != 'p') fiftyMoveDrawCount++;
            else fiftyMoveDrawCount = 0;
            if (fiftyMoveDrawCount == 100){
                setTimeout(() => {
                    gameMessage(piece_selected[0], 'Fifty Move Rule' , 'Draw');
                  }, "500");
            }

            if(move_count >= 10){
                let moveRep = moves[move_count - 1] + moves[move_count - 2];
                if(moveRep == (moves[move_count - 5] + moves[move_count - 6])){
                        setTimeout(() => {
                            gameMessage(piece_selected[0], 'Three Fold Repition' , 'Draw');
                          }, "500");
                    }
            }

            pieceCount = currentPieceCount; // updating current number of pieces
            if (gamestatus == 'checkmate') {
                console.log(moves);
                setTimeout(() => {
                    gameMessage(piece_selected[0] , 'Checkmate' , 'Checkmate')
                  }, "500");
            }
            else if (gamestatus == 'stalemate') {
                setTimeout(() => {
                    gameMessage(piece_selected[0], 'Stalemate','Draw');
                  }, "500");
            }
            if(currentTurn === 'black'){
                pieces = document.body.querySelectorAll('.piece');
                pieces.forEach(piece =>{
                    if(piece.classList.contains('disabled')){
                        piece.classList.remove('disabled');
                    }
                    else{
                        piece.classList.add('disabled');
                    }
                    if(piece.classList.contains('en-passant') && piece.classList.contains('bp')){
                        piece.classList.remove('en-passant');
                    }
                })
                
            }
            else if(currentTurn === 'white'){
                pieces.forEach(piece =>{
                    if(piece.classList.contains('disabled')){
                        piece.classList.remove('disabled');
                    }
                    else{
                        piece.classList.add('disabled');
                    }
                    if(piece.classList.contains('en-passant') && piece.classList.contains('wP')){
                        piece.classList.remove('en-passant');
                    }
                })
            }
        }
    }
};
document.addEventListener('dragstart', dragStartHandler);
document.addEventListener('dragover', dragOverHandler);
document.addEventListener('drop', dropHandler);

function gameButton(e){
    if(e.target.id == 'resign-button'){
        setTimeout(() => {
            gameMessage(piece_selected[0], 'Resign','Resign');
          }, "500");
    }
    else if(e.target.id == 'draw-button'){
        setTimeout(() => {
            alert('draw offer sent');
            disableAllEvents();
          }, "500");
    }
}
document.addEventListener('click',gameButton);

async function gameMessage(colour,message,status){
    let pieceColour = (colour == 'w') ? 'White' : 'Black';
    if (message == 'Checkmate' || message == 'Resign' || message == 'Timeout') pieceColour += ' wins by ' + message;
    else pieceColour = 'Game drawn by ' + message;
    let messages = [status,pieceColour]
    gameResultBox.style.visibility = 'visible';
    gameResultBox.classList.add('animate');
    for(let i = 0; i < resultText.length; i++) resultText[i].innerHTML = messages[i];
    const close = await resultBoxClose();
    if (close) disableAllEvents();
}

function resultBoxClose(){
    return new Promise((resolve) => {
        document.getElementById('close-icon').addEventListener('click', function() {
        gameResultBox.style.visibility = 'hidden';
        gameResultBox.classList.remove('animate');
        for(let i = 0; i < resultText.length; i++) resultText[i].innerHTML = '';
        resolve(true);
        } ,{ once: true });
    });
}


function disableAllEvents() {
    setTimeout(() => {
        chessboard.innerHTML = '';
        moveStore.innerHTML = '';
        document.addEventListener('click' , timeControl,{once : true})
        setBoard();
      }, "100");
}