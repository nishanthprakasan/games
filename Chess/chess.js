//lower case - black upper case - white
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

let currentTurn = 'white'; 
let move_count = 0;
let move = [];//storing one line of move
let moves = [];// storing all the moves
let check = false;//storing status of king check
const chessboard = document.querySelector('.chessboard');

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

//setting the lower part of the board according to current users piece colour
if (window.user_current.colour === 'black') {
    chessboard.classList.add('flip');
    const squares = chessboard.querySelectorAll('.piece');
    squares.forEach(square =>{
        square.classList.add('flip');
    });
}
let draggedPiece = null; // storing the dragged piece

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('piece') && !e.target.classList.contains('disabled')) {
        draggedPiece = e.target;
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault(); 
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    // finding target square
    let target = e.target;
    while (target && !target.classList.contains('square')) {
        target = target.parentElement;
    }
    let piece_selected = draggedPiece.classList[1];//storing piece selected
    let initialPosition = draggedPiece.parentNode.id;//storing starting position of piece
    let finalPosition = target.id;// storing final position of piece
    if (isValid(piece_selected,initialPosition,finalPosition,target,draggedPiece,false) && draggedPiece) {
        const existingPiece = target.querySelector('.piece');
        // checking for empty square or opp square
        if (!existingPiece || (draggedPiece.classList[1] !== existingPiece.classList[1])) {
            if(existingPiece){
                if((draggedPiece.classList[1][0] !== existingPiece.classList[1][0])){
                    target.appendChild(draggedPiece); 
                    if((target.id[1] == 8 || target.id[1] == 1) && draggedPiece.classList[1][1].toLowerCase() == 'p'){
                        handlePromotion(piece_selected[0],target);
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
                }
                // changing the position of the piece according to move
                draggedPiece = null; // resetting piece
                currentTurn = currentTurn === 'white' ? 'black' : 'white'
            }
            console.log(checkMate(piece_selected));
            move.push(piece_selected+finalPosition);
            if(currentTurn == 'white' && move_count != 0){// need to add the validation for draw
                moves.push(storeMoves(move));
                move = [];
                move_count++;
            }
            else{
                move_count++;
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
                })
            }
        }
    }
});

