// ..:: Global Variables
const overlay = document.querySelector('.overlay');
const overlayPvp = document.querySelector('.pvp');
const overlayIntro = document.querySelector('.intro');
const overlayGameOver = document.querySelector('.gameOver');



// ..:: Event Listeners
const gridItems = document.querySelectorAll('.grid-item');
gridItems.forEach((item)=>{
    item.addEventListener('click', gridClick);
});

document.querySelector('#btn-PvP').addEventListener('click', () => {
    overlayIntro.classList.add('hide');
    overlayPvp.classList.remove('hide');
});

document.querySelector('#btn-PvC').addEventListener('click', () => {
    alert('Sorry, Player vs Computer not yet implemented');
});

document.querySelector('#btnStartPvP').addEventListener('click', () => {
    GameBoard.setPlayerName(1, document.querySelector('#nameP1').value);
    GameBoard.setPlayerName(2, document.querySelector('#nameP2').value);

    overlay.classList.add('hide');
    overlayPvp.classList.add('hide');
});

document.querySelector('#btnPlayAgain').addEventListener('click', () => {
    GameBoard.resetBoard();
});

document.querySelector('#btnMenu').addEventListener('click', () => {
    GameBoard.resetBoard();

    overlay.classList.remove('hide');
    overlayIntro.classList.remove('hide');

    overlay.setAttribute('style', 'opacity: 100%;');
});


// ..:: Functions

// - Factory Functions
// Player Factory
const Player = str => {
    // Declares the names of the icons used in Material Icons Font in CSS
    const x = 'close'; 
    const o = 'fiber_manual_record';

    let playerName = 'Player';

    const setName = name => { playerName = name; }
    const getName = () => { return playerName }

    const getString = () => { return str == 'x' ? x : o; };
    const getSimpleString = () => { return str };

    return { getString, getSimpleString, setName, getName }
}



// Module for gameboard
const GameBoard = (() => {
    let boardArr;
    let status = { 
            currentPlayer: '', 
            winningPlayer: '',
            isOver: false 
        };
    const player1 = Player('x');
    const player2 = Player('o');
    player1.setName('Player 1');
    player2.setName('Player 2');

    const createBoard = () => { boardArr = [[], [], []] };
    const resetBoard = () => { 
        createBoard(); 
        displayController.resetGrid();
        status.isOver = false; 
    }

    const getBoard = function(){
        if(!boardArr) createBoard();
        return boardArr
    };

    const setPlayerName = (player, name) => {
            if (player == 1) { player1.setName(name) } else { player2.setName(name) }
        };

    const alternatePlayer = () => { status.currentPlayer = status.currentPlayer == player1 ? player2 : player1 }


    const gameOver = () => { status.isOver = true; status.winningPlayer = status.currentPlayer; }

    // Returns true if game is over, false if not
    const tryGameOver = () => {
        let str = status.currentPlayer.getSimpleString();
        let winningArr = JSON.stringify([str, str, str]);

        // NOTE: JSON.stringigy is used as a mean to compare the arrays. Similar result could be achieved by using the .toString() method
        // Test diaogonals first
        let mainDiaog = [boardArr[0][0], boardArr[1][1], boardArr[2][2]];
        if (JSON.stringify(mainDiaog) == winningArr) { return true }

        let secondaryDiaog = [boardArr[0][2], boardArr[1][1], boardArr[2][0]];
        if (JSON.stringify(secondaryDiaog) == winningArr) { return true }

        // Test row then column
        for (let i = 0; i < 3; i++) {
            if (JSON.stringify(boardArr[i]) == winningArr) { return true }

            let column = [];
            for (let j = 0; j < 3; j++) {
                column.push(boardArr[j][i]);                
            }
            if (JSON.stringify(column) == winningArr) { return true }                        
        }

        // If no tests are true, return false
        return false
    };


    // Main function: takes a string input as 2 char (e.g. '01'), beeing the 1st one the row of the play and the 2nd the column
    const play = function(location){
        let row = location[0];
        let col = location[1];

        // If cell is empty, play. If not, return false
        if (getBoard()[row][col] == undefined) {
            alternatePlayer();
            getBoard()[row][col] = status.currentPlayer.getSimpleString();

            if (tryGameOver()) { gameOver() }

            return true
        }
         
        return false
    }


    return { setPlayerName, play, resetBoard, status, getBoard}
})();



// Module for display control
const displayController = (() => {

    const gameOver = () => {
        // alert (`Game over. ${GameBoard.status.winningPlayer.getName()} won!`);

        document.querySelector('.overlay .gameOver strong').textContent = GameBoard.status.winningPlayer.getName();

        overlay.classList.remove('hide');
        overlayGameOver.classList.remove('hide');
        overlay.setAttribute('style', 'opacity: 90%;');
    };

    const render = (HTMLElem) => {
        // Adds the play to the board
        HTMLElem.textContent = GameBoard.status.currentPlayer.getString();

        if (GameBoard.status.isOver){
            gameOver()
        }
    }

    const resetGrid = () => {
        // Removes all entries in the board
        document.querySelectorAll('.item-content').forEach(cell => { cell.textContent = "" });

        overlay.classList.add('hide');
        overlayGameOver.classList.add('hide');
    };

    return { render, resetGrid }
})();



// - Listener Functions
function gridClick(e) {
    let item = e.target.firstElementChild;

    // Bypass in case the user clicks on top of the text, not the empty div (not ideal solution, but fixes an error)
    if (item == undefined) return

    // If cell is empty, make the play and render the board
    if (GameBoard.play(e.target.dataset.elem)) displayController.render(item);
}


// ..:: Script