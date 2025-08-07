class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.moveHistory = [];
        
        // DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.status = document.getElementById('status');
        this.restartBtn = document.getElementById('restartBtn');
        this.undoBtn = document.getElementById('undoBtn');
        
        // Winning combinations
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        // Event listeners
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.undoBtn.addEventListener('click', () => this.undoMove());
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (this.board[index] === '' && this.gameActive) {
            // Save the current state before making the move
            this.moveHistory.push({
                board: [...this.board],
                currentPlayer: this.currentPlayer,
                gameActive: this.gameActive
            });
            
            this.board[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            
            if (this.checkWin()) {
                this.status.textContent = `Player ${this.currentPlayer} wins!`;
                this.gameActive = false;
                this.undoBtn.disabled = true; // Disable undo on win
                this.celebrateWin();
            } else if (this.checkDraw()) {
                this.status.textContent = "Game ended in a draw!";
                this.gameActive = false;
                this.undoBtn.disabled = true; // Disable undo on draw
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.status.textContent = `Player ${this.currentPlayer}'s turn`;
                this.undoBtn.disabled = false; // Enable undo only for active game
            }
        }
    }

    celebrateWin() {
        // Create a confetti burst from the center
        const centerBurst = () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        };

        // Create side bursts
        const sideBurst = (startX, angle) => {
            confetti({
                particleCount: 50,
                angle: angle,
                spread: 55,
                origin: { x: startX, y: 0.7 }
            });
        };

        // Initial burst
        centerBurst();

        // Side bursts
        setTimeout(() => {
            sideBurst(0, 60);  // Left side
            sideBurst(1, 120); // Right side
        }, 200);

        // Final burst
        setTimeout(centerBurst, 500);
    }

    undoMove() {
        if (this.moveHistory.length > 0) {
            // Restore the previous state
            const previousState = this.moveHistory.pop();
            this.board = previousState.board;
            this.currentPlayer = previousState.currentPlayer;
            this.gameActive = previousState.gameActive;
            
            // Update the UI
            this.cells.forEach((cell, index) => {
                cell.textContent = this.board[index];
            });
            this.status.textContent = `Player ${this.currentPlayer}'s turn`;
            
            // Disable undo button if no more moves to undo
            if (this.moveHistory.length === 0) {
                this.undoBtn.disabled = true;
            }
        }
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.moveHistory = [];
        this.cells.forEach(cell => cell.textContent = '');
        this.status.textContent = `Player ${this.currentPlayer}'s turn`;
        this.undoBtn.disabled = true;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 