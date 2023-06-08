/*----- constants -----*/
const TILE_COLOR_LOOKUP = {
    'closed': {value: 0, color: 'darkgray'},
    'open': {value: 1, color: 'lightgray'},
    'numbers': {value: 3, color: 'lightgray'},
    'flag': {value: 2, color: 'yellow'},
    'bomb': {value: -1, color: 'red'},
}
// This constant will help populate the board with mines. Can adjust number for difficulty //
const NUM_OF_MINES = 10;

/*----- app's state (variables) -----*/
// 1. Stated the state variables that I wanted to visualize in the browser //
// Started with board, loser and winner. Will Probably adjust later //
let board;

let winner;

/*----- cached element references -----*/
// 2. Cached the elements from HTML that I wanted to make interactive //

const messageEl = document.querySelector("h1");

const playAgainBtn = document.querySelector("button");

// const tileEls = [...document.querySelectorAll('#board > div')];

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleTile);

playAgainBtn.addEventListener('click', init);

/*----- functions -----*/
// 3. Stubbing up the init function, along with all the callback functions connected to it //

init();

function init() {
    // At first, I did a 2d Array board, where I had 10 lines of nulls. But then I found the new Array and fill method, which made it look alot cleaner. I also gave the object 2 different properties, the value to represent what kind of tile it is, and status to represent if its closed or open //
    board = new Array(100).fill({value: 0, status: 'closed'});
    winner = false;
    generateMines();
    render();
}

function handleTile(evt) {
    // This one took me a LONGGG time to figure out. After a lot of trial and error, I found that I had to split my id tile so it can grab the tile number. Not only that, I had to turn the whole string into an integer with parseInt //
    const tileIndex = parseInt(evt.target.id.split('-')[1]);
    if (board[tileIndex].value === -1) {
        loser = true;
        revealBombTiles();
    } else if (board[tileIndex].value === 0) {
        revealTile(tileIndex);
        checkWinCondition();
    }
    render();
}

function revealBombTiles() {
    board.forEach(function(tile, idx) {
        if (tile.value === -1) {
            tile.status = 'open';
        }
    })
}

function revealTile(tileIndex) {
    board[tileIndex].status = 'open'
}

function checkWinCondition() {
    // At first, I thought about coding it saying for all tiles to be open for winner to be true, but then I realized I could just make the remaining closed tiles = to the number of mines instead //
    const closedTiles = board.filter(function(tile) {
        return tile.status === 'closed';
        if (closedTiles.length === NUM_OF_MINES) {
            winner = true;
        }
    })
}

function getTileColor(tileValue, tileStatus) {
    if (tileStatus === 'open') {
        return TILE_COLOR_LOOKUP[tileValue === -1 ? 'bomb': 'open'].color;
    } 
}
// This function will help place the mines randomly on the board //
function getRandomIndex() {
    return Math.floor(Math.random() * board.length);
}

// Decided to create a function to call within renderBoard to generate the mines after it makes the board //
function generateMines() {
    let minesPlaced = 0;
    // This while loop basically says, it will check the board and place mines on tiles that doesn't have the value of -1, and will keep doing that function until the max numbers of mines are reached, and it also closes the tile to keep them hidden //
    while (minesPlaced < NUM_OF_MINES) {
        const randomIndex = getRandomIndex();
        if (board[randomIndex].value !== -1) {
            board[randomIndex] = {value: -1, status: 'closed'};
            minesPlaced++;
        }
    }
}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(function(tile, idx) {
        const tileEl = document.getElementById(`tile-${idx}`);
        // This line basically makes sure the tiles are closed //
        const tileStatus = tile.status || 'closed';
        // And then this line retrieves the color from TILE_COLOR_LOOKUP //
        const color = getTileColor(tile.value, tileStatus);
        // And finally, this line sets up the background color of the tile when clicked //
        tileEl.style.backgroundColor = color;
        });
    }

function renderMessage() {
    if (winner === true) {
        messageEl.textContent = "You Win!"
    } else if (board.some(function(tile) {
        return tile.status === 'open' && tile.value === -1;
    })) {
        messageEl.textContent = "Game Over!"
    } else {
        messageEl.textContent = "";
    }
}

function renderControls() {
    // Learned how to use the hidden button function using Ternary Expression from the Connect 4 code along video //
    playAgainBtn.style.visibility = winner ? 'visible': 'hidden';
}
