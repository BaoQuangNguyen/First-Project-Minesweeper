/*----- constants -----*/

const TILE_COLOR_LOOKUP = {
    // I made this variable into an object, so I would be able to access both the value and color //
    'closed': {value: 0, color: 'darkgray'},
    'open': {value: 1, color: 'lightgray'},
    'mine': {value: -1, color: 'red'},
}
// This constant will help populate the board with mines. Can adjust number for difficulty //
const NUM_OF_MINES = 2;

/*----- app's state (variables) -----*/

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
    // I kept this function inside here to help reset the board once the player has pressed the play again button //
    tileEls.forEach(function(tileEl) {
        tileEl.innerHTML = '';
      })
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
    calculateNumbers();
}

function getRandomIdx() {
    return Math.floor(Math.random() * board.length);
}

function calculateNumbers() {
    for (let i = 0; i < board.length; i++) {
        const tile = board[i];
        if (tile.value !== -1) {
            const adjacentTiles = getAdjacentTiles(i);
            let count = 0;
            adjacentTiles.forEach(function(adjTileIdx) {
                if (board[adjTileIdx].value === -1) {
                    count++;
                }
            })
            tile.value = count;
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
      const tileStatus = tile.status || 'closed';
      const color = getTileColor(tile.value, tileStatus);  
      if (tileStatus === 'open') {
        if (tile.value === -1) {
            // This code applies the mine image on the mine tiles //
          tileEl.innerHTML = '<img src="mine.png" alt="Mine" style="width: 100%; height: 100%;" draggable="false">';
          // This is the code that gives visualization to the numbers on the tiles adjacent to the mines //
        } else if (tile.value !== 0) {
          tileEl.innerHTML = tile.value;
        } else {
          tileEl.innerHTML = '';
        }
      }
      tileEl.style.backgroundColor = color;
    })
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

function handleTile(evt) {
    // This is a guard that prevents the player to click on any more tiles once the win condition is decided //
    if (winner !== null) {
        return;
    }
    // Another guard I used to prevent the players from clicking in between the tiles //
    if (evt.target.tagName !== 'DIV') {
        return;
    }
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

function handleRightClick(evt) {
    // This code prevents the context menu from popping up //
    evt.preventDefault();
    if (winner === null) {
        const tileIdx = parseInt(evt.target.id.split('-')[1]);
        const tile = board[tileIdx];
        // This if else statement give the players to add and remove flags if needed //
        if (tile.status === 'closed') {
            tile.status = 'flag';
        } else if (tile.status === 'flag') {
            tile.status = 'closed';
        }
    }
    render();
}

function rightClickFlag() {
    board.forEach(function(tile, idx) {
        const tileEl = document.getElementById(`tile-${idx}`);
        if (tile.status === 'flag') {
            tileEl.style.backgroundColor = 'yellow';
        } else if (tile.status === 'closed') { 
            tileEl.style.backgroundColor = getTileColor(tile.value, tile.status);
        }
    })
}

function checkWinCondition() {
    let uncoveredTiles = 0;
    let flaggedMines = 0;
    board.forEach(function(tile) {
        if (tile.status === 'closed') {
            uncoveredTiles++;
        } else if (tile.status === 'flag' && tile.value === -1) {
            flaggedMines++;
        }
    });
    if (uncoveredTiles + flaggedMines === NUM_OF_MINES) {
        winner = true;
    }
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

function flood(tileIdx) {
    // With the combination of the 2 functions getAdjacentTiles and flood, it repeats the flood function filling every open tile until it reachs a stopping condition, which would be the numbers //
    const tile = board[tileIdx];
    if (tile.status === 'closed') {
        tile.status = 'open';
        if (tile.value === 0) {
            const adjacentTiles = getAdjacentTiles(tileIdx);
            adjacentTiles.forEach(function(adjTileIdx) {
                flood(adjTileIdx);
            })
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

function getTileColor(tileValue, tileStatus) {
    if (tileStatus === 'open') {
        return TILE_COLOR_LOOKUP[tileValue === -1 ? 'mine': 'open'].color;
    } else if (tileStatus === 'closed') {
        return TILE_COLOR_LOOKUP[tileValue === 0 ? 'closed': 'closed'].color;
    }
}
