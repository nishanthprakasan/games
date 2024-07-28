let game = document.querySelector('.game_screen')
let main_screen = document.querySelector('.main-screen');
let game_rows = game.querySelector('.rows');
let reset_game = game.querySelector('.reset');
let winner = game.querySelector('.winner');
let new_game = game.querySelector('.new-game');
let player_1;
let player_2;
let chance = 1;
let count = 0;
let text_content = [];
let mode = null;
main_screen.addEventListener('click',(e)=>{
    mode = e.target.className;
    if(mode == 'player-button-multi'){
        player_1 = prompt('Enter name of player 1: ');
        player_2 = prompt('Enter name of player 2: ');
    }
    else if(mode == 'player-button-single'){
        player_1 = prompt('Enter name of player 1: ');
        player_2 = 'Computer';
    }
    main_screen.style.display = 'none';
    game.style.display ='flex';
    game.style.flexDirection ='column';
    game_rows.addEventListener('click',(e)=>{
        pos = '.' + e.target.className;
        cell_click = game_rows.querySelector(pos);
        if (cell_click.textContent){
            alert('Position already contains a value');
        }
        else{
            if (chance == 1){
                cell_click.textContent = 'X';
                cell_click.style.backgroundColor = '#d4adab';
                if(player_2 != 'Computer'){
                    chance = 2;
                }
                else{
                    computerMove();
                }
                count++;
            } 
            else if(chance == 2){
                if(player_2 != 'Computer'){
                    cell_click.style.backgroundColor = '#d4adab';
                    cell_click.textContent = 'O';
                }
                chance = 1;
            }  
        }
        if (count >= 3){
            inp = gameInput();
            result = checkWinner(inp);
            displayWinner(result,player_1,player_2);
        }
    })
    
    reset_game.addEventListener('click',(e) =>{
        clearButton();
        count = 0;
        chance = 1;
    })
})

reset_game.addEventListener('click',(e) =>{
    buttons = game_rows.querySelectorAll('button');
    clearButton();
    count = 0;
    chance = 1;
})

new_game.addEventListener('click',(e)=>{
    game_rows.style.display ='flex';
    reset_game.style.display ='flex';
    new_game.style.display = 'none';
    count = 0;
    chance = 1;
    winner.textContent = '';
    clearButton();
})

function checkWinner(inp){
    const winningCombination = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ];
    for(const combination of winningCombination){
        const [x,y,z] = combination;
        if(inp[x] != ' ' && inp[x]==inp[y] && inp[y]==inp[z]){
            return inp[x];
        }
    }
    count = 0
    for(let each of inp){
        if(each != ' '){
            count++;
        }
    }
    if(count == 9){
        return 'Tie';
    }
}

function displayWinner(result,player_1,player_2){
        if (result == 'X'){
            game_rows.style.display ='none';
            reset_game.style.display ='none';
            winner.textContent = `${player_1} has won🔥`;
            new_game.style.display = 'flex';
        }
        else if(result == 'O'){
            game_rows.style.display ='none';
            reset_game.style.display ='none';
            winner.textContent = `${player_2} has won🔥`;
            new_game.style.display = 'flex';
        }
        else if(result == 'Tie'){
            winner.textContent = 'Tie';
            game_rows.style.display ='none';
            reset_game.style.display ='none';
            new_game.style.display = 'flex';
        }
}

function gameInput(){
    text_content = game_rows.textContent;
    user_input = text_content.split('\n');
    user_input.pop();
    user_input.shift();
    for(let i = 0;i < user_input.length;i++){
        user_input[i] = user_input[i][user_input[i].length - 1];
    }
    return user_input;
}
function clearButton(){
    buttons = game_rows.querySelectorAll('button');
    buttons.forEach(button =>{
        button.style.backgroundColor = '#ffffc7';
        button.textContent='';
    })
}

function computerMove(){
    square_status = gameInput();
    const winningCombination = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ];
    for(const combination of winningCombination){
        const [x,y,z] = combination;
        content = square_status[x]+square_status[y]+square_status[z];
        let countX = 0;
        let countO = 0;
        let countSpace = 0;
        let indexSpace = null;
        for(let i = 0;i < 3;i++){
            if (content[i] == 'X'){
                countX++;
            }
            else if(content[i] == ' '){
                countSpace++;
                indexSpace = combination[i];
            }
            else if(content[i] =='O'){
                countO++;
            }
        }
        if((square_status[x]==square_status[y] || square_status[y]==square_status[z]
            ||square_status[x] == square_status[z]) && (countX == 2 || countO == 2)
                && countSpace == 1){
            pos = '.position-' + indexSpace;
            cell_click = game_rows.querySelector(pos);
            cell_click.textContent = 'O';
            cell_click.style.backgroundColor = '#d4adab';
            return;
        }
    }
    for(const combination of winningCombination){
        const [x,y,z] = combination;
        content = square_status[x]+square_status[y]+square_status[z];
        let countSpace = 0;
        let countO = 0;
        let indexSpace = null;
        for(let i =0;i < 3;i++){
            if(content[i] == ' '){
                countSpace++;
                indexSpace = combination[i];
            }
            else if(content[i] == 'O'){
                countO++;
            }    
            if(countSpace == 2 && countO == 1){
            pos = '.position-'+indexSpace;
            cell_click = game_rows.querySelector(pos);
            cell_click.textContent = 'O';
            cell_click.style.backgroundColor = '#d4adab';
            return;
            }
        }
    }
    const filteredArray = square_status.filter(element => element !== ' ');
    console.log(filteredArray);
    if (filteredArray.length == 1 && square_status[4] == ' '){
        cell_click = game_rows.querySelector('.position-4');
        cell_click.textContent = 'O';
        cell_click.style.backgroundColor = '#d4adab';
        return;
    }
    for(let i = 0;i < 9; i++){
        if(square_status[i] == ' '){
        pos = '.position-'+i;
        cell_click = game_rows.querySelector(pos);
        cell_click.textContent = 'O';
        cell_click.style.backgroundColor = '#d4adab';
        return;
        }
    }
}