let board = Array(3).fill('-').map(() => Array(3).fill('-'));
let activePanel = [0, 0];
let playerShape = 'X';
let computerShape = 'O';
let playerScore = 0;
let computerScore = 0;

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    switch (keyName) {
        case 'ArrowRight':
            if (activePanel[1] !== 2) activePanel[1]++;
            break;
        case 'ArrowLeft':
            if (activePanel[1] !== 0) activePanel[1]--;
            break;
        case 'ArrowUp':
            if (activePanel[0] !== 0) activePanel[0]--;
            break;
        case 'ArrowDown':
            if (activePanel[0] !== 2) activePanel[0]++;
            break;
        case 'Enter':
            const content = document.getElementById(activePanel.toString()).innerHTML;
            if (!content) {
                document.getElementById(activePanel.toString()).innerHTML = playerShape;
                board[activePanel[0]][activePanel[1]] = playerShape;
                computerPlay();
            }
            break;
        case 'Escape':
            break;
    }
    const selectedCell = document.getElementsByClassName("selected");
    if (selectedCell) selectedCell[0].classList.remove("selected");
    document.getElementById(activePanel.toString()).classList.add("selected");
    checkWinningCondition();
});

const checkWinningCondition = () => {
    if (horizontalWin(playerShape) || verticalWin(playerShape) || diagonalWin(playerShape)) {
        playerScore++;
        addScore("playerScore");
        playAgain("Player won!, Do you want to play again?");
    } else if (horizontalWin(computerShape) || verticalWin(computerShape) || diagonalWin(computerShape)) {
        computerScore++;
        addScore("computerScore");
        playAgain("Computer won!, Do you want to play again?");
    } else {
        if (rowIsNotEmpty(board[0]) && rowIsNotEmpty(board[1]) && rowIsNotEmpty(board[2])) {
            playAgain("Its a draw!, Do you want to play again?");
        }
    }
}

const rowIsNotEmpty = (row) => {
    return row.every((c => c !== '-'))
}
const horizontalWin = (shape) => {
    for (const row of board) {
        if (row.every((r => r === shape))) {
            return true;
        }
    }
    return false;
}
const verticalWin = (shape) => {
    for (let i = 0; i < board[0].length; i++) {
        const column = board.map(x => x[i]);
        if (column.every((c => c === shape))) {
            return true;
        }
    }
    return false;
}
const diagonalWin = (shape) => {
    return (board[0][0] === shape &&
        board[1][1] === shape &&
        board[2][2] === shape) ||
        (board[0][2] === shape &&
            board[1][1] === shape &&
            board[2][0] === shape)
}
const resetBoard = () => {
    board.forEach(x => x.fill("-"));
    const allCells = document.querySelectorAll('.boardCell');
    allCells.forEach(c => c.innerHTML = "");
}
const addScore = (player) => {
    const score = player === "playerScore" ? playerScore : computerScore;
    document.getElementById(player).innerHTML = "Score: " + score;
}
const computerPlay = () => {
    const allCells = document.querySelectorAll('.boardCell');
    const avaliableCells = Array.from(allCells).filter(x => x.innerHTML === '');
    if (avaliableCells.length > 0) {
        const randomCell = Math.floor(Math.random() * avaliableCells.length);
        avaliableCells[randomCell].innerHTML = computerShape;
        const coordinates = avaliableCells[randomCell].id.split(",");
        board[coordinates[0]][coordinates[1]] = computerShape;
    }

}
const playAgain = (message) => {
    if (confirm(message)) {
        initPlayer();
        resetBoard();
    }
    document.getElementById("gameScreen").classList.add("disabled");

}
window.onload = initialMessage = () => {
    if (confirm("Do you want to play?")) {
        initPlayer();
    }
}