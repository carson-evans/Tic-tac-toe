// Tic Tac Toe game
/*

    0 | 1 | 2
    3 | 4 | 5
    6 | 7 | 8

*/

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
//            winner = boardState[a];
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
} // end of resetGame

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (boardState[index] === '' && gameStatus) {
            boardState[index] = currentPlayer;
            cell.textContent = currentPlayer;
            moves++;
//          fillCell(cell, index);
            
            checkWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });
});


// Event Listeners
//cells.forEach(cell => cell.addEventListener('click', handleMove));
reset.addEventListener('click', resetGame);

// End of script.js