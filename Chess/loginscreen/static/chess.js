//lower case - black upper case - white
// NEED TO FIX DRAW OFFER
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
let socket = null;
let colour = 'white';
const game = document.querySelector('.game');
const chessboard = document.querySelector('.chessboard');
const moveStore = document.body.querySelector('.move-store');
const gameResultBox = document.body.querySelector('.game-result');
const gameResult = document.body.querySelector('.result');
const closeIcon = document.body.querySelector('close-icon');
const resultText = gameResult.querySelectorAll('p');
let whiteTime = document.body.querySelector('.time-player-white');
let blackTime = document.body.querySelector('.time-player-black');
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
		console.log(e.target.id);
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
    let newgame = await newGame(e);
    if(newgame){
        fetch(updateAction, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: new URLSearchParams({
                'action': 'new_game'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'redirect') {//user in this should be black
                colour = 'black'
                console.log(data.user , 'black')
                document.body.querySelector('.player-details-black').innerHTML = data.opponent
                flipBoard()
                pieces = document.body.querySelectorAll('.piece');
                pieces = document.body.querySelectorAll('.piece');
                pieces.forEach(piece =>{
                    if(!piece.classList.contains('disabled')) piece.classList.add('disabled')
                })
                let roomId = data.room_id;
                document.body.querySelector('.game').style.pointerEvents = 'auto';
                inititalTimer();
                const url = `ws://127.0.0.1:8000/ws/play/${roomId}/`
                console.log(url)
                socket = new WebSocket(url);
                socket.onmessage = function(e){
                    let socketData = JSON.parse(e.data)
                    console.log(socketData)
                    if(socketData.type == 'game_status'){
                        gameMessage(socketData.colour, socketData.message,socketData.status)
                    }
                    else if (socketData.type === 'game_move' && currentTurn == 'white') {
                        console.log('black to move')
                        handleOpponentMove(socketData);
                        pieces = document.body.querySelectorAll('.piece');
                        pieces.forEach(piece =>{
                            if(piece.classList[1][0] == 'b') piece.classList.remove('disabled')
                        })
                        currentTurn ='black'
                        console.log('inside socket' , currentTurn)
                    }
                    else{
                        pieces = document.body.querySelectorAll('.piece');
                        pieces.forEach(piece =>{
                            if(!piece.classList.contains('disabled')) piece.classList.add('disabled')
                        })
                        currentTurn = 'white'
                    }
                }
            } 
            else if (data.status === 'waiting_for_opponent') {
                console.log('Waiting for opponent...');
                opponentRequest(data.room_id)
            }
        });
    }
}

function opponentRequest(id){
    console.log('looking')
    let intervalId = setInterval(() => {
        fetch(checkOpp, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: new URLSearchParams({
                'action': 'new_game',
                'id': id,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'redirect') {// user in this is white
                clearInterval(intervalId);  
                console.log(data.user , 'white')
                colour = 'white'
                document.body.querySelector('.game').style.pointerEvents = 'auto';
                document.body.querySelector('.player-details-black').innerHTML = data.opponent
                inititalTimer();
                const url = `ws://127.0.0.1:8000/ws/play/${data.room_id}/`
                console.log(url)
                socket = new WebSocket(url);
                socket.onmessage = function(e){
                    let socketData = JSON.parse(e.data)
                    console.log(data)
                    if(socketData.type == 'game_status'){
                        gameMessage(socketData.colour, socketData.message,socketData.status)
                    }
                    else if (socketData.type === 'game_move'  && currentTurn == 'black') {
                        handleOpponentMove(socketData);
                        pieces = document.body.querySelectorAll('.piece');
                        pieces.forEach(piece =>{
                            if(piece.classList[1][0] == 'w') piece.classList.remove('disabled')
                        })
                        console.log('white to move')
                        currentTurn = 'white'
                    }
                    else{
                        pieces = document.body.querySelectorAll('.piece');
                        pieces.forEach(piece =>{
                            if(!piece.classList.contains('disabled')) piece.classList.add('disabled')
                        })
                        currentTurn = 'black'
                    }
                }  
            }
        });
    }, 2000);
}

function flipBoard(){
    chessboard.classList.add('flip');
    const squares = chessboard.querySelectorAll('.piece');
    squares.forEach(square =>{
        square.classList.add('flip');
    });
    //need to swap the players time
    document.body.querySelector('.time-player-black').classList.add('temp')
    document.body.querySelector('.time-player-white').classList.add('time-player-black')
    document.body.querySelector('.time-player-white').classList.remove('time-player-white')
    document.body.querySelector('.temp').classList.add('time-player-white')
    document.body.querySelector('.temp').classList.remove('time-player-black')
    document.body.querySelector('.temp').classList.remove('temp')

    whiteTime = document.body.querySelector('.time-player-white');
    blackTime = document.body.querySelector('.time-player-black');
    updateTimer()
}


function handleOpponentMove(data) {
    if(data.piece){
        const piece = data.piece;
        const initialPos = data.initialPos;
        const finalPos = data.finalPos;
        const castle = data.castle;
        console.log(data.piece)
        const pieceElement = document.getElementById(`${initialPos}`);
        const finalSquare = document.getElementById(`${finalPos}`);
        if(pieceElement.children[0]){
            console.log(finalSquare)
            const existingPiece = finalSquare.querySelector('.piece');
            if (existingPiece && existingPiece.classList[1][0] != piece[0]) {
                existingPiece.remove();
            }
            finalSquare.appendChild(pieceElement.children[0]);
            if(castle[0]){
                const initial = document.getElementById(castle[1])
                const final = document.getElementById(castle[2])
                console.log(initial)
                console.log(final)
                console.log(initial.children[0])
                final.appendChild(initial.children[0])
            }
        }
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
            gameEndSocket('b','Timeout','Timeout')
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
                gameEndSocket('b','Timeout','Timeout')
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
                gameEndSocket('w','Timeout','Timeout')
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
    console.log('inside dropHandler',currentTurn)
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
                gameEndSocket(piece_selected[0], 'Fifty Move Rule' , 'Draw')
                setTimeout(() => {
                    gameMessage(piece_selected[0], 'Fifty Move Rule' , 'Draw');
                  }, "500");
            }

            if(move_count >= 10){
                let moveRep = moves[move_count - 1] + moves[move_count - 2];
                if(moveRep == (moves[move_count - 5] + moves[move_count - 6])){
                    gameEndSocket(piece_selected[0], 'Three Fold Repition' , 'Draw')
                        setTimeout(() => {
                            gameMessage(piece_selected[0], 'Three Fold Repition' , 'Draw');
                          }, "500");
                    }
            }

            pieceCount = currentPieceCount; // updating current number of pieces
            if (gamestatus == 'checkmate') {
                gameEndSocket(piece_selected[0] , 'Checkmate' , 'Checkmate')
                setTimeout(() => {
                    gameMessage(piece_selected[0] , 'Checkmate' , 'Checkmate')
                  }, "500");
            }
            else if (gamestatus == 'stalemate') {
                gameEndSocket(piece_selected[0], 'Stalemate','Draw')
                setTimeout(() => {
                    gameMessage(piece_selected[0], 'Stalemate','Draw');
                  }, "500");
            }
            if(currentTurn === 'black'){
                pieces = document.body.querySelectorAll('.piece');
                pieces.forEach(piece =>{
                    if(piece.classList.contains('en-passant') && piece.classList.contains('bp')){
                        piece.classList.remove('en-passant');
                    }
                })
                
            }
            else if(currentTurn === 'white'){
                pieces.forEach(piece =>{
                    if(piece.classList.contains('en-passant') && piece.classList.contains('wP')){
                        piece.classList.remove('en-passant');
                    }
                })
            }
        }
    }
};
if(currentTurn[0] == colour[0]){
    document.addEventListener('dragstart', dragStartHandler);
    document.addEventListener('dragover', dragOverHandler);
    document.addEventListener('drop', dropHandler);
}
else{
    document.removeEventListener('dragstart', dragStartHandler);
    document.removeEventListener('dragover', dragOverHandler);
    document.removeEventListener('drop', dropHandler);
}


function gameButton(e){
    if(e.target.id == 'resign-button'){
        gameEndSocket(piece_selected[0], 'Resign','Resign')
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

function gameEndSocket(colour,message,status){
    socket.send(JSON.stringify({
        'action' : 'game_status',
        'colour' : colour,
        'message' : message,
        'status' : status
    }))
}

function disableAllEvents() {
    setTimeout(() => {
        chessboard.innerHTML = '';
        moveStore.innerHTML = '';
        document.addEventListener('click' , timeControl,{once : true})
        setBoard();
      }, "100");
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}