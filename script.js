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
let scoreX = parseInt(localStorage.getItem('scoreX'), 10) || 0;
let scoreO = parseInt(localStorage.getItem('scoreO'), 10) || 0;


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

const clearScoresButton = document.getElementById('clear-scores');

clearScoresButton.addEventListener('click', clearScores);

// fill cells with X or O
const fillCell = (cell, index) => {
    cell.textContent = boardState[index];

    if (boardState[index] === 'X') {
        cell.classList.add('x');
    } else {
        cell.classList.add('o');
    }
}

function resetBoard() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    gameStatus = true;
    // might want to toggle who starts first in the next game, for example
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameDisplay(); // Any UI updates you have for a new game state
}

const checkWinner = () => {
    let winnerDetected = false;
    let winningSymbol = null; // Variable to hold the winning symbol ('X' or 'O')

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    winningConditions.forEach((condition) => {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameStatus = false;
            highlightWinningCombo(condition);
            winnerDetected = true;
            winningSymbol = boardState[a]; // Capture the winning symbol
            // Use the names from local storage
            const winnerName = winningSymbol === 'X' ? localStorage.getItem('player1Name') || 'Player 1' : localStorage.getItem('player2Name') || 'Player 2';
            resultElement.textContent = `${winnerName} has won!`;
        }
    });

    if (moves === 9 && gameStatus) {
        gameStatus = false;
        resultElement.textContent = `It's a tie!`;
    }

    if (winnerDetected) {
        incrementScore(winningSymbol); // Increment score using the winning symbol
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
        cell.classList.remove('x', 'o', 'highlight');
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

function clearScores() {
    // Reset scores to 0
    scoreX = 0;
    scoreO = 0;

    // Update the scoreboard display
    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;

    // Clear scores from local storage
    localStorage.setItem('scoreX', scoreX);
    localStorage.setItem('scoreO', scoreO);
}


// Function to load scores from local storage
function loadScores() {
    const scoreX = localStorage.getItem('scoreX') || 0;
    const scoreO = localStorage.getItem('scoreO') || 0;

    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;
}

// Function to update scores in local storage
function updateScore(winner) {
    if (winner === 'X') {
        const scoreX = parseInt(localStorage.getItem('scoreX') || '0') + 1;
        localStorage.setItem('scoreX', scoreX);
        document.getElementById('score-x').textContent = scoreX;
    } else if (winner === 'O') {
        const scoreO = parseInt(localStorage.getItem('scoreO') || '0') + 1;
        localStorage.setItem('scoreO', scoreO);
        document.getElementById('score-o').textContent = scoreO;
    }
}

// Call loadScores when the page loads to display the current scores
loadScores();

// Call updateScore when there is a winner
// updateScore('X'); or updateScore('O');


const highlightWinningCombo = (combo) => {
    combo.forEach(index => {
        const cell = document.getElementById(`cell-${index}`);
        cell.classList.add('highlight');
    });

}

function updateScoreboard() {
    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;
}

function incrementScore(winnerSymbol) {
    if (winnerSymbol === 'X') {
        scoreX++;
        localStorage.setItem('scoreX', scoreX);
    } else if (winnerSymbol === 'O') {
        scoreO++;
        localStorage.setItem('scoreO', scoreO);
    }
    updateScoreboard();
}

// This function sets the names and starts the game
function handleSetNamesAndStartGame() {
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');

    // Save the names in local storage
    localStorage.setItem('player1Name', player1NameInput.value || 'Player 1');
    localStorage.setItem('player2Name', player2NameInput.value || 'Player 2');

    // Start the game
    resetBoard();
    // Hide the setup UI
    document.getElementById('player-setup').style.display = 'none';
    document.querySelector('.game').style.display = 'block'; // Show the game board
}

// Call this when the page loads to set the names from local storage if they exist
function loadPlayerNames() {
    const player1Name = localStorage.getItem('player1Name') || 'Player X';
    const player2Name = localStorage.getItem('player2Name') || 'Player O';
    updatePlayerNameDisplays(player1Name, player2Name);
}

// Update player name displays wherever needed
function updatePlayerNameDisplays(player1Name, player2Name) {
    // Example: Update elements that show the player's current turn
    // document.getElementById('currentPlayerDisplay').textContent = `${player1Name}'s Turn`;
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

document.getElementById('play-human').addEventListener('click', function () {
    document.querySelector('.game').style.display = 'block'; // Show game board
    document.querySelector('.game-mode-selection').style.display = 'none'; // Hide game mode selection
    playingAgainstAI = false; // Set playing mode to human
    startNewGame();
});

document.getElementById('play-ai').addEventListener('click', function () {
    document.querySelector('.game').style.display = 'block'; // Show game board
    document.querySelector('.game-mode-selection').style.display = 'none'; // Hide game mode selection
    playingAgainstAI = true; // Set playing mode to AI
    startNewGame();
});

document.addEventListener('DOMContentLoaded', updateScoreboard);

// Add an event listener to 'Set Names & Start Game' button
document.getElementById('startGame').addEventListener('click', handleSetNamesAndStartGame);

// Load player names on page load
document.addEventListener('DOMContentLoaded', loadPlayerNames);

// End of script.js
