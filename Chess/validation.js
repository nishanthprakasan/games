//DOES NOT CHECK FOR PINS
//CANNOT CAPTURE CHECK GIVING PIECE 
function isCheck(colour){//does not check for pins still
    //console.log('checking....');
    let colourAttacker = null;
    if(colour == 'w'){//using to finding the colour of king
        colour = 'wK';
        colourAttacker = 'b';
    }
    else {
        colour = 'bk';
        colourAttacker = 'w';
    }
    let kingPosition = document.getElementsByClassName(colour)[0].parentNode.id;

    if(colourAttacker == 'b'){
        colourAttacker += 'p';
    }
    else{
        colourAttacker += 'P';
    }
    let pawns = document.getElementsByClassName(colourAttacker);
    for(let pawn of pawns){
        let initialFile = pawn.parentNode.id[0];
        let initialRank = parseInt(pawn.parentNode.id[1]);
        let valid = null;
        if(colourAttacker == 'wP'){
            valid = checkWhitePawnMove(initialFile,initialRank,kingPosition);
        }
        else{
            valid = checkBlackPawnMove(initialFile,initialRank,kingPosition);
        }
        //console.log('check complete');
        if(valid == true){
            console.log('entered');
            return false;
        }
    }

    // finalpos - kingpos initial pos- opp colour piece piece-colourAttacker
    if(colourAttacker[0] == 'b'){
        colourAttacker = 'bn';
    }
    else{
        colourAttacker = 'wN';
    }
    let knights = document.getElementsByClassName(colourAttacker);
    for(let knight of knights){
        let initialFile = knight.parentNode.id[0];
        let initialRank = parseInt(knight.parentNode.id[1]);
        let valid = checkKnightMove(initialFile,initialRank,kingPosition);
        console.log('check complete');
        if(valid == true){
            console.log('entered');
            return false;
        }
    }

    if(colourAttacker[0] == 'b'){
        colourAttacker = 'bb';
    }
    else{
        colourAttacker = 'wB';
    }
    let bishops = document.getElementsByClassName(colourAttacker);
    for(let bishop of bishops){
        let initialFile = bishop.parentNode.id[0];
        let initialRank = parseInt(bishop.parentNode.id[1]);
        //console.log(initialFile,initialRank,existingPiece,kingPosition,colourAttacker);
        let valid = checkBishopMove(initialFile,initialRank,kingPosition);
        //console.log('check complete');
        if(valid == true){
            console.log('entered');
            return false;
        }
    }

    if(colourAttacker[0] == 'b'){
        colourAttacker = 'br';
    }
    else{
        colourAttacker = 'wR';
    }
    let rooks = document.getElementsByClassName(colourAttacker);
    for(let rook of rooks){
        let initialFile = rook.parentNode.id[0];
        let initialRank = parseInt(rook.parentNode.id[1]);
        //console.log("initial",initialFile,initialRank);
        //console.log("king position", kingPosition[0],parseInt(kingPosition[1]));
        let valid = checkRookMove(initialFile,initialRank,kingPosition);
        //console.log('check complete');
        if(valid == true){
            console.log('entered');
            return false;
        }
    }

    if(colourAttacker[0] == 'b'){
        colourAttacker = 'bq';
    }
    else{
        colourAttacker = 'wQ';
    }
    let queens = document.getElementsByClassName(colourAttacker);
    for(let queen of queens){
        let initialFile = queen.parentNode.id[0];
        let initialRank = parseInt(queen.parentNode.id[1]);
        //console.log("initial",initialFile,initialRank);
        //console.log("king position", kingPosition[0],parseInt(kingPosition[1]));
        let valid = checkRookMove(initialFile,initialRank,kingPosition) || checkBishopMove(initialFile,initialRank,kingPosition);
        //console.log('check complete');
        if(valid == true){
            console.log('entered');
            return false;
        }
    }

    let kings = document.getElementsByClassName(colour);
    for(let king of kings){
        let initialFile = king.parentNode.id[0];
        let initialRank = parseInt(king.parentNode.id[1]);
        //console.log("initial",initialFile,initialRank);
        //console.log("king position", kingPosition[0],parseInt(kingPosition[1]));
        let valid = checkKingMove(initialFile,initialRank,kingPosition);
        //console.log('check complete');
        if(valid == true){
            console.log('entered');
            return false;
        }
    }

    return true;
}

function isValid(piece, initialPos, finalPos, target){//need to do solve what to do after check
    const initialFile = initialPos[0];// stores the alphabet of notation
    const initialRank = parseInt(initialPos[1]);//stores the number of notation
    const existingPiece = target.querySelector('.piece');
    if (initialPos === finalPos){
        return false;
    }

    switch (piece) {
        case 'wP':
            if (checkWhitePawnMove(initialFile,initialRank,finalPos) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
            return false;

        case 'bp':
            if (checkBlackPawnMove(initialFile,initialRank,finalPos) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
            return false;

        case 'wR':
        case 'br':
            if (checkRookMove(initialFile,initialRank,finalPos) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
            console.log('in check');
            return false;

        case 'wB':
        case 'bb':
            if (checkBishopMove(initialFile,initialRank,finalPos) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
            console.log('in check');
            return false;

        case 'wQ':
        case 'bq':
            if((checkRookMove(initialFile,initialRank,finalPos) || checkBishopMove(initialFile,initialRank,finalPos)) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){ 
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
        return false;

        case 'wN':
        case 'bn':
            if (checkKnightMove(initialFile,initialRank,finalPos) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
            console.log('in check');
            return false;
            
        case 'wK':
        case 'bk':
            if (checkKingMove(initialFile,initialRank,finalPos) &&
            handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece)){
                console.log('entered');
                console.log(existingPiece);
                if(existingPiece){
                    console.log(existingPiece.classList[1][0],piece[0]);
                    if (existingPiece.classList[1][0] !== piece[0]){
                        if(existingPiece.classList[1][1].toLowerCase() != 'k'){
                            console.log('2');
                            existingPiece.remove();
                        }
                        return true;
                    } else{
                        return false;
                    }
                }
                return true;
            }
            console.log('in check');
            return false;
    }
    return false;
}

function checkBlackPawnMove(initialFile,initialRank,finalPos){
    let finalId = '#'+finalPos;
    let pieceOpp = document.body.querySelector(finalId).children;
    if(pieceOpp.length != 0){
        pieceOpp = pieceOpp[0].classList[1][0];
    }
    // pawn forward move by one
    if (finalPos[0] === initialFile && parseInt(finalPos[1]) === initialRank - 1){
        return true;
    }
    // double move on first turn
    if (initialRank === 7 && finalPos[0] === initialFile && parseInt(finalPos[1]) === 5){
        return true;
    }
    // capturing
    if (Math.abs(finalPos[0].charCodeAt(0) - initialFile.charCodeAt(0)) === 1 && parseInt(finalPos[1]) === initialRank - 1 
    && pieceOpp == 'w') {
        return true;
    }
    console.log('1');
    return false;
}

function checkWhitePawnMove(initialFile,initialRank,finalPos){
    let finalId = '#'+finalPos;
    let pieceOpp = document.body.querySelector(finalId).children;
    if(pieceOpp.length != 0){
        pieceOpp = pieceOpp[0].classList[1][0];
    }
    // pawn forward move by one
    if (finalPos[0] === initialFile && parseInt(finalPos[1]) === initialRank + 1){
        return true;
    }
    // double move on first turn
    if (initialRank === 2 && finalPos[0] === initialFile && parseInt(finalPos[1]) === 4){
        return true;
    }
    // capturing
    if (Math.abs(finalPos[0].charCodeAt(0) - initialFile.charCodeAt(0)) === 1 && parseInt(finalPos[1]) === initialRank + 1
     && pieceOpp == 'b'){
        console.log('1');
        return true;
    }
    return false;
}

function checkKnightMove(initialFile,initialRank,finalPos){
    const move =  [[2, 1], [2, -1], [-2, 1], [-2, -1], 
                      [1, 2], [1, -2], [-1, 2], [-1, -2]]; //all possible movements of knight
        for(let m of move){
            let possibleFile = String.fromCharCode(initialFile.charCodeAt(0) + m[0]);
            let possibleRank = initialRank + m[1];
            if(possibleFile >= 'a' && possibleFile <= 'h' && possibleRank >= 1 
                && possibleRank <= 8 && (possibleFile + possibleRank) === finalPos ){
                    return true;
                }
        }
        return false;
}

function checkRookMove(initialFile,initialRank,finalPos) {
    //console.log(finalFile+finalRank);
    // vertical movement
    if (finalPos[0] === initialFile) {
        let min = Math.min(initialRank, parseInt(finalPos[1]));
        let max = Math.max(initialRank, parseInt(finalPos[1]));
        for (let i = min + 1; i < max; i++) {
            if (document.getElementById(`${finalPos[0]}${i}`).childNodes.length > 0) {
                return false;
            }
        }
        return true;
    }
    // horizontal movement
    if (parseInt(finalPos[1]) === initialRank) {
        let min = Math.min(initialFile.charCodeAt(0), finalPos[0].charCodeAt(0));
        let max = Math.max(initialFile.charCodeAt(0), finalPos[0].charCodeAt(0));
        for (let i = min + 1; i < max; i++) {
            if (document.getElementById(`${String.fromCharCode(i)}${parseInt(finalPos[1])}`).childNodes.length > 0) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function checkBishopMove(initialFile,initialRank,finalPos) {

    let countRight = initialFile.charCodeAt(0) + 1;
    let countLeft = initialFile.charCodeAt(0) - 1;
    let rightUp = true;
    let rightDown = true;
    let leftUp = true;
    let leftDown = true;
    for (let j = 1; j <= 8; j++){
        let tempUp = initialRank + j; //storing file ranks for upper 
        let tempDown = initialRank - j; //storing file ranks for lower

        if(rightUp && String.fromCharCode(countRight) <= 'h' && tempUp <= 8){//right up
            let move = String.fromCharCode(countRight) + tempUp;
            if(move === finalPos) {
                return true;
            }
            if(document.getElementById(move).childNodes.length > 0){
                rightUp = false;
            }
        }

        if(rightDown && String.fromCharCode(countRight) <= 'h' && tempDown >= 1){//right down
            let move = String.fromCharCode(countRight) + tempDown;
            if (move === finalPos){
                return true;
            }
            if (document.getElementById(move).childNodes.length > 0){
                rightDown = false;
            }
            
        }

        if (leftUp && String.fromCharCode(countLeft) >= 'a' && tempUp <= 8){//left up
            let move = String.fromCharCode(countLeft) + tempUp;
            if (move === finalPos){
                return true;
            }
            if (document.getElementById(move).childNodes.length > 0){
                leftUp = false;
            }

        }

        if (leftDown && String.fromCharCode(countLeft) >= 'a' && tempDown >= 1){//left down
            let move = String.fromCharCode(countLeft) + tempDown;
            if (move === finalPos){
                return true;
            }
            if (document.getElementById(move).childNodes.length > 0){
                leftDown = false;
            }
        }

        countRight++;
        countLeft--;
    }
    return false;
}

function checkKingMove(initialFile,initialRank,finalPos){
    const moveKing = [[1, 1], [1, 0], [1, -1], [0, -1], 
    [0, 1], [-1, 1], [-1, 0], [-1, -1]]; // all possible movements of king
    for(let m of moveKing){
        let possibleFile = String.fromCharCode(initialFile.charCodeAt(0) + m[0]);
        let possibleRank = initialRank + m[1];
        if(possibleFile >= 'a' && possibleFile <= 'h' && possibleRank >= 1 
        && possibleRank <= 8 && (possibleFile + possibleRank) === finalPos){
            return true;
        }
    }
}

function handleCheck(piece,existingPiece,target,initialPos,finalPos,draggedPiece){
    console.log(existingPiece)
    console.log(target.childNodes);
    console.log(piece , finalPos);
    let targetRemove = document.getElementById(target.id);
    let initialSquare = document.getElementById(initialPos);
    let finalSquare = document.getElementById(finalPos);
    let pieceColour = null;
    console.log(targetRemove);
    if(existingPiece){
        pieceColour = existingPiece.classList[1][0];
    }
    if(existingPiece && finalPos == target.id && draggedPiece.classList[1][0] != pieceColour){
        console.log('entered');
        existingPiece.remove();
        if(isCheck(piece[0])){
            console.log('2');
            return true;
        }
        initialSquare.appendChild(draggedPiece);
        targetRemove.appendChild(existingPiece);
        return false;
    }
    finalSquare.appendChild(draggedPiece);
    if(isCheck(piece[0]) && draggedPiece.classList[1][0] != pieceColour){
        console.log('2');
        finalSquare.removeChild(draggedPiece); //removing the element as is gets added back
        return true;
    }
    console.log('in check');
    finalSquare.removeChild(draggedPiece);
    initialSquare.appendChild(draggedPiece);
    return false;
}

function storeMoves(move){
    let notation_move = [];
    move.forEach(element => {
        if(element[1].toLowerCase() == 'p'){
            notation_move.push(element.substring(2));
        }
        else{
            notation_move.push(element[1].toUpperCase() + element.substring(2));
        }
    });
    return notation_move;
}

