// ..:: Global Variables



// ..:: Event Listeners
const gridItems = document.querySelectorAll('.grid-item');
gridItems.forEach((item)=>{
    item.addEventListener('click', gridClick);
});




// ..:: Functions

// - Factory Functions
// Player Factory
const Player = str => {
    // Declares the names of the icons used in Material Icons Font in CSS
    const x = 'close'; 
    const o = 'fiber_manual_record';


    const getString = () => { return str == 'x' ? x : o; };
    const getSimpleString = () => { return str };

    return { getString, getSimpleString }
}



// Module for gameboard
const GameBoard = (() => {
    let boardArr;
    let status = { 
            currentPlayer: '', 
            isOver: false 
        };
    const player1 = Player('x');
    const player2 = Player('o');

    const createBoard = () => { boardArr = [[], [], []] };
    const resetBoard = () => { createBoard(); gameStatus.isOver = false; }

    const getBoard = function(){
        if(!boardArr) createBoard();
        return boardArr
    };

    const alternatePlayer = () => { status.currentPlayer = status.currentPlayer == player1 ? player2 : player1 }

    const getCurrentPlayer = () => { return status.currentPlayer };

    const gameOver = () => { status.isOver = true; }

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
                column.push(boardArr[i][j]);                
            }
            if (JSON.stringify(column) == winningArr) { return true }                        
        }

        console.log({winningArr})
        console.log({mainDiaog})

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


    return { play, resetBoard, getCurrentPlayer, status }
})();



// Module for display control
const displayController = (() => {

    const render = (HTMLElem) => {
        HTMLElem.textContent = GameBoard.status.currentPlayer.getString();

        if (GameBoard.status.isOver){
            alert ('Game over!');
        }
    }

    return { render }
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