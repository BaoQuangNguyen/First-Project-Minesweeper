/*----- constants -----*/


/*----- app's state (variables) -----*/


/*----- cached element references -----*/


/*----- event listeners -----*/


/*----- functions -----*/







// MINESWEEPER


/* PSEUDOCODE


// DEFINE REQUIRED CONSTANTS //
1. Define a tile object as 'null' when it is still clickable, empty as 1, numbers as 2 and bomb as -1


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
3. Initialize winner to null
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

** while loops / boolean */