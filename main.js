/*----- constants -----*/

const TILE_COLOR_LOOKUP = {
    // I made this variable into an object, so I would be able to access both the value and color //
    'closed': {value: 0, color: 'darkgray'},
    'open': {value: 1, color: 'lightgray'},
    'mine': {value: -1, color: 'red'},
}

// This constant will help populate the board with mines. Can adjust number for difficulty //

const NUM_OF_MINES = 30;

/*----- app's state (variables) -----*/
// Started with board, loser and winner. Will Probably adjust later //
// Ended up taking out loser because it didnt make sense to have both a winner and loser variable //

let board;

let winner;


/*----- cached element references -----*/

const messageEl = document.querySelector("h1");

const playAgainBtn = document.querySelector("button");

const tileEls = [...document.querySelectorAll('#board > div')];

/*----- event listeners -----*/

document.getElementById('board').addEventListener('click', handleTile);

document.getElementById('board').addEventListener('contextmenu', handleRightClick);

playAgainBtn.addEventListener('click', init);

/*----- functions -----*/

init();

function init() {
    // At first, I did a 2d Array board, where I had 10 lines of nulls. But then I found the new Array and fill method, which made it look alot cleaner. I also gave the object 2 different properties, the value to represent what kind of tile it is, and status to represent if its closed or open //
    // I spent majority of thursday trying to troubleshoot why all my tiles were opening when I clicked on a tile that wasn't a bomb. Turns out, fill was causing that issue. //
    board = new Array(100);
    for (i = 0 ; i < 100 ; i++) {
        board[i] = {value: 0, status: 'closed'};
    }
    winner = null;
    // I had to invoke the generateMines function within the init function, so it would only generate the mines once //
    generateMines();
    render();
}

function rightClickFlag() {
    board.forEach(function(tile, idx) {
        const tileEl = document.getElementById(`tile-${idx}`);
        if (tile.status === 'flag') {
            tileEl.innerHTML = '&#9873;';
            tileEl.style.backgroundColor = 'yellow';
        } else {
            tileEl.innerHTML = '';
            tileEl.style.backgroundColor = getTileColor(tile.value, tile.status);
        }
    })
}

function handleRightClick(evt) {
    evt.preventDefault();
    const tileIdx = parseInt(evt.target.id.split('-')[1]);
    const tile = board[tileIdx];
    if (tile.status === 'closed') {
        tile.status = 'flag';
    } else if (tile.status === 'flag') {
        tile.status = 'closed';
    }
    render();
}

function handleTile(evt) {
    // This one took me a LONGGG time to figure out. After a lot of trial and error, I found that I had to split my id tile so it can grab the tile number. Not only that, I had to turn the whole string into an integer with parseInt //
    const tileIdx = parseInt(evt.target.id.split('-')[1]);
    if (board[tileIdx].value === -1) {
        winner = false;
        revealMineTiles();
    } else if (board[tileIdx].value === 0) {
        flood(tileIdx);
        checkWinCondition();
    } else {
        revealTile(tileIdx);
        checkWinCondition();
    }
    render();
}

function flood(tileIdx) {
    // With the combination of the 2 functions getAdjacentTiles and flood, it repeats the flood function filling every open tile until it reachs a stopping condition, which would've been the numbers //
    const tile = board[tileIdx];
    if (tile.status === 'closed') {
        tile.status = 'open';
        if (tile.value === 0) {
            const adjacentTiles = getAdjacentTiles(tileIdx);
            adjacentTiles.forEach(adjTileIdx => flood(adjTileIdx));
        }
    }
}

function getAdjacentTiles(tileIdx) {
    const adjacentTiles = [];
    // For row and col, it figures out the tile index by dividing the tile index by 10 for row, and getting the remainder for col //
    const row = Math.floor(tileIdx / 10);
    const col = tileIdx % 10;
    // Both for loops, loops over the neighboring row and columns //
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            // This code makes sure that everything would be in valid range. In this case, nothing out of a 10x10 grid would be valid //
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                // This code is what calculates the index of the neighboring tiles
                const adjTileIdx = newRow * 10 + newCol;
                // This code makes sure that the selected tile is excluded //
                if (adjTileIdx !== tileIdx) {
                    adjacentTiles.push(adjTileIdx);
                }
            }
        }
    }
    return adjacentTiles;
}

function revealMineTiles() {
    board.forEach(function(tile, idx) {
        if (tile.value === -1) {
            tile.status = 'open';
        }
    })
}

function revealTile(tileIdx) {
    board[tileIdx].status = 'open'
}

function checkWinCondition() {
    // At first, I thought about coding it saying for all tiles to be open for winner to be true, but then I realized I could just make the remaining closed tiles = to the number of mines instead //
    const closedTiles = board.filter(function(tile) {
        return tile.status === 'open';
    })
    if (closedTiles.length === NUM_OF_MINES) {
        winner = true;
    }
}

function getTileColor(tileValue, tileStatus) {
    if (tileStatus === 'open') {
        return TILE_COLOR_LOOKUP[tileValue === -1 ? 'mine': 'open'].color;
    } 
}

function getRandomIdx() {
    return Math.floor(Math.random() * board.length);
}

function generateMines() {
    let minesPlaced = 0;
    // This while loop basically says, it will check the board and place mines on tiles that doesn't have the value of -1, and will keep doing that function until the max numbers of mines are reached, and it also closes the mine tile to keep them hidden //
    while (minesPlaced < NUM_OF_MINES) {
        const randomIdx = getRandomIdx();
        if (board[randomIdx].value !== -1) {
            board[randomIdx] = {value: -1, status: 'closed'};
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
        rightClickFlag();
    }

function renderMessage() {
    if (winner === true) {
        messageEl.textContent = "You Win!"
    } else if (winner === false) {
        messageEl.textContent = "Game Over!"
    } else {
        messageEl.textContent = "";
    }
}

function renderControls() {
    // Learned how to use the hidden button function using Ternary Expression from the Connect 4 code along video //
    playAgainBtn.style.visibility = winner !== null ? 'visible': 'hidden';
}
