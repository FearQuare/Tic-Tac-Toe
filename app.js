// script.js

// IIFE Module for the gameboard logic
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    // Method to update the board
    const setMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    // Method to reset the board
    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    // Method to get the current state of the board
    const getBoard = () => board;

    return { setMarker, reset, getBoard };
})();

// Factory function to create players
const Player = (name, marker) => {
    return { name, marker };
};

// IIFE Module to control game flow
const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameActive = false;

    // Winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Start the game
    const startGame = (p1Name, p2Name) => {
        player1 = Player(p1Name, "X");
        player2 = Player(p2Name, "O");
        currentPlayer = player1;
        gameActive = true;
        Gameboard.reset();
        DisplayController.render();
    };

    // Check for a win
    const checkWin = () => {
        const board = Gameboard.getBoard();
        return winningCombinations.some(combo => {
            const [a, b, c] = combo;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    // Check for a tie
    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    // Handle player's move
    const playRound = (index) => {
        if (!gameActive) return;
        if (Gameboard.setMarker(index, currentPlayer.marker)) {
            if (checkWin()) {
                DisplayController.displayResult(`${currentPlayer.name} wins!`);
                gameActive = false;
            } else if (checkTie()) {
                DisplayController.displayResult("It's a tie!");
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                DisplayController.render();
            }
        }
    };

    // Reset the game
    const resetGame = () => {
        gameActive = false;
        Gameboard.reset();
        DisplayController.render();
    };

    return { startGame, playRound, resetGame };
})();

// IIFE Module to control the display
const DisplayController = (() => {
    const boardDiv = document.getElementById("gameboard");
    const resultDiv = document.getElementById("result");

    // Render the gameboard on the page
    const render = () => {
        boardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.textContent = cell;
            cellDiv.addEventListener("click", () => GameController.playRound(index));
            boardDiv.appendChild(cellDiv);
        });
    };

    // Display the result (win/tie)
    const displayResult = (message) => {
        resultDiv.textContent = message;
    };

    return { render, displayResult };
})();

// Event listeners for Start and Reset buttons
document.getElementById("startButton").addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value || "Player 1";
    const player2Name = document.getElementById("player2").value || "Player 2";
    GameController.startGame(player1Name, player2Name);
});

document.getElementById("resetButton").addEventListener("click", GameController.resetGame);