// Selects
const cells = document.querySelectorAll('.cell');
const board = document.querySelector('.game');
const reset = document.querySelector('#restart');
const resultElement = document.querySelector('#result');

// Variables
let currentPlayer = 'X';
let gameStatus = true;
let moves = 0;
let winner = null;
let boardState = ['', '', '', '', '', '', '', '', ''];


// Functions
const handleMove = (e) => {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (boardState[index] === '' && gameStatus) {
        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        moves++;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
};

// fill cells with X or O
const fillCell = (cell, index) => {
    cell.textContent = boardState[index];

    if (boardState[index] === 'X') {
        cell.classList.add('x');
    } else {
        cell.classList.add('o');
    }
}

const checkWinner = () => {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    winningConditions.forEach((condition) => {
        const [a, b, c] = condition;

        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameStatus = false;
            resultElement.textContent = `Player ${boardState[a]} has won!`;
        }
    });

    if (moves === 9 && gameStatus) {
        gameStatus = false;
        resultElement.textContent = `It's a tie!`;
    }
}

const resetGame = () => {
    currentPlayer = 'X';
    gameStatus = true;
    moves = 0;
    winner = null;
    boardState = ['', '', '', '', '', '', '', '', ''];

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');    
    })
    resultElement.textContent = '';

    // Hide the game board and show the game mode selection
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.game-mode-selection').style.display = 'block';
} // end of resetGame

// AI move function
function aiMove() {
    // Check if it's the AI's turn
    if (currentPlayer === 'O') {
        // Check if the game is still in progress
        if (!gameStatus || currentPlayer !== 'O') {
            return;
        }

        // Randomly select an empty cell
        let availableCells = [];
        boardState.forEach((cell, index) => {
            if (cell === '') availableCells.push(index);
        });

        const move = availableCells[Math.floor(Math.random() * availableCells.length)];
        if (move !== undefined) {
            boardState[move] = currentPlayer;
            document.getElementById(`cell-${move}`).textContent = currentPlayer;
            moves++;
            checkWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        }

    }
}

// Event Listeners

// Modify the event listener for cells to include AI move is playing against AI
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (boardState[index] === '' && gameStatus) {
            // Player's move
            boardState[index] = currentPlayer;
            cell.textContent = currentPlayer;
            moves++;            
            checkWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            // Trigger AI move if playing against AI
            if (playingAgainstAI) {
                setTimeout(aiMove, 500); // Delay AI move by 500ms for better UX
            }
        }
    });
});

reset.addEventListener('click', resetGame);

document.getElementById('play-human').addEventListener('click', function() {
    document.querySelector('.game').style.display = 'block'; // Show game board
    document.querySelector('.game-mode-selection').style.display = 'none'; // Hide game mode selection
    playingAgainstAI = false; // Set playing mode to human
    startNewGame();
});

document.getElementById('play-ai').addEventListener('click', function() {
    document.querySelector('.game').style.display = 'block'; // Show game board
    document.querySelector('.game-mode-selection').style.display = 'none'; // Hide game mode selection
    playingAgainstAI = true; // Set playing mode to AI
    startNewGame();
});

// End of script.js
