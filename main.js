/*----- constants -----*/
const TILE_COLOR_LOOKUP = {
    '0': 'darkgray',
    '1': 'lightgray',
    '-1': 'red',
    
};

/*----- app's state (variables) -----*/
// 1. Stated the state variables that I wanted to visualize in the browser //
// Started with board, loser and winner. Will Probably adjust later //
let board;

let loser;

let winner;

/*----- cached element references -----*/
// 2. Cached the elements from HTML that I wanted to make interactive //

const messageEl = document.querySelector("h1");

const playAgainBtn = document.querySelector("button");

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleTile);
playAgainBtn.addEventListener('click', init);

/*----- functions -----*/
// 3. Stubbing up the init function, along with all the callback functions connected to it //

init();

function init() {
    // At first, I did a 2d Array board, where I had 10 lines of nulls. But then I found the new Array and fill method, which made it look alot cleaner //
    board = new Array(100).fill(0);
    loser = -1;
    winner = null;
    render();
}

function handleTile(evt) {

}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(function(tileVal, idx) {
        const tileEl = document.getElementById(`tile-${idx}`);
        // console.log(tileEl);
        // Decided to do just the background color for the clickable tiles and bomb for now //
        tileEl.style.backgroundColor = TILE_COLOR_LOOKUP[tileVal];
        });
    }



function renderMessage() {
    if (loser === '-1') {
        messageEl.innerText = 'GAME OVER';
    } else if (winner) {
        messageEl.innerText = 'YOU WIN!';
    } else {
        return;
    }
}

function renderControls() {
    // Learned how to use the hidden button function using Ternary Expression from the Connect 4 code along video //
    playAgainBtn.style.visibility = winner ? 'visible': 'hidden';
}

// MINESWEEPER


/* PSEUDOCODE


// DEFINE REQUIRED CONSTANTS //
1. Define a tile object as 'null' when it is still clickable, empty as 0, numbers as 1 and bomb as -1


// DEFINE STATE VARIABLES //
1. Tile array for minesweeper field
2. Winner variable
3. Loser variable


// STORE CACHE ELEMENTS/VARIABLES (DOM) //
1. Store the 10x10 null tiles
2. Store the Play Again button


// UPON LOADING THE APP //
1. Initialize the state variables.
2. Initialize the tile array to 10x10 nulls to represent the 100 clickable squares
3. Initialize winner to no nulls left included
4. Initialize Render(); to render the state variables
5. Render the Tiles
6. Loop over all the tiles, when clicked, 8 tiles surrounding the included center, will change the object value from null to empty(1), (2) if it contains a number, or -1 if it contains a bomb
7. Probably? use if else statements to loop around until we find either a winner(if no more nulls) or loser(if value -1)
8. If winner or loser is called, render message to state 'You Win!" or "You Lose!" (will also use a hidden button eventlistener for this)
9. If value still contains null, wait for user to click again


// HANDLE A PLAYER CLICKING A TILE AND REPLAY BUTTON //
1. Using event listeners to make the tiles clickable
2. If message pops up after winning or lose, reveal the play again button
3. If play again button is pressed, start Initialize();



// OTHER THOUGHTS //
1. I have to add something called the flood feature
2. Might have to add some sort of picture icon for the numbers and bomb
3. If possible, could add some sounds when clicking the tiles and bomb

So I made this pseudocode with the help of the guide from the 'TIC TAC TOE" homework, and it somewhat helps me get an idea of what to look for. I am still not very confident with functions, callback functions and DOM manipulation, so I didn't have a surefire way yet to connect all the different functions, variables and DOM elements yet.




// Things to do or look up //
1. Have to learn how the flood feature works
2. Should look into while loops and boolean and see how I can apply it
3. Have to figure out how to to make sure all adjacent tiles that aren't numbers or bombs become 'un-nulled' after being uncovered
4. Have to figure out how to uncover all bomb tiles, once player clicks on bomb. Also changing the background color of the bomb that was clicked to red
5. Might consider having different board sizes for difficulty levels. Have to figure out how to code that through JS










*/

