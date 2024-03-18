// Selects
const cells = document.querySelectorAll('.cell');
const board = document.querySelector('.game');
const reset = document.querySelector('#restart');
const resultElement = document.querySelector('#result');
const clearScoresButton = document.getElementById('clear-scores');

// Variables
let currentPlayer = 'X';
let gameStatus = true;
let moves = 0;
let winner = null;
let boardState = ['', '', '', '', '', '', '', '', ''];
let scoreX = parseInt(localStorage.getItem('scoreX'), 10) || 0;
let scoreO = parseInt(localStorage.getItem('scoreO'), 10) || 0;

// Event Listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (boardState[index] === '' && gameStatus) {
            boardState[index] = currentPlayer;
            cell.textContent = currentPlayer;
            moves++;
            checkWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (playingAgainstAI) {
                setTimeout(aiMove, 500);
            }
        }
    });
});

reset.addEventListener('click', resetGame);

document.getElementById('play-human').addEventListener('click', function () {
    document.querySelector('.game').style.display = 'block';
    document.querySelector('.game-mode-selection').style.display = 'none';
    playingAgainstAI = false;
    startNewGame();
});

document.getElementById('play-ai').addEventListener('click', function () {
    document.querySelector('.game').style.display = 'block';
    document.querySelector('.game-mode-selection').style.display = 'none';
    playingAgainstAI = true;
    startNewGame();
});

document.addEventListener('DOMContentLoaded', updateScoreboard);

document.getElementById('startGame').addEventListener('click', handleSetNamesAndStartGame);

document.addEventListener('DOMContentLoaded', loadPlayerNames);

clearScoresButton.addEventListener('click', clearScores);

// Functions
// Todo: Fix bug where the game doesn't start after selecting "play vs AI"
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
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameDisplay();
}

const checkWinner = () => {
    let winnerDetected = false;
    let winningSymbol = null;

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
            winningSymbol = boardState[a];
            const winnerName = winningSymbol === 'X' ? localStorage.getItem('player1Name') || 'Player 1' : localStorage.getItem('player2Name') || 'Player 2';
            resultElement.textContent = `${winnerName} has won!`;
        }
    });

    if (moves === 9 && gameStatus) {
        gameStatus = false;
        resultElement.textContent = `It's a tie!`;
    }

    if (winnerDetected) {
        incrementScore(winningSymbol);
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

    document.querySelector('.game').style.display = 'none';
    document.querySelector('.game-mode-selection').style.display = 'block';
}

function aiMove() {
    if (currentPlayer === 'O') {
        if (!gameStatus || currentPlayer !== 'O') {
            return;
        }

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
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }
}

function clearScores() {
    scoreX = 0;
    scoreO = 0;

    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;

    localStorage.setItem('scoreX', scoreX);
    localStorage.setItem('scoreO', scoreO);
}

function loadScores() {
    const scoreX = localStorage.getItem('scoreX') || 0;
    const scoreO = localStorage.getItem('scoreO') || 0;

    document.getElementById('score-x').textContent = scoreX;
    document.getElementById('score-o').textContent = scoreO;
}

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

loadScores();

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

function handleSetNamesAndStartGame() {
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');

    localStorage.setItem('player1Name', player1NameInput.value || 'Player 1');
    localStorage.setItem('player2Name', player2NameInput.value || 'Player 2');

    resetBoard();
    document.getElementById('player-setup').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
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
