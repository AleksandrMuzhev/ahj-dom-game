const goblinImage = require('../img/goblin.png');

class GoblinGame {
    constructor(boardSize = 4) {
        this.boardSize = boardSize;
        this.board = null;
        this.cells = [];
        this.currentPosition = null;
        this.hitCount = 0;
        this.missCount = 0;
        this.intervalId = null;
        this.goblinElement = null;
        this.isGameOver = false;
    }

    init() {
        console.log('Game initializing...');
        this.createBoard();
        this.createGoblin();
        this.startGame();
        this.updateScore();
    }

    createBoard() {
        this.board = document.getElementById('game-board');
        if (!this.board) {
            console.error('Game board element not found!');
            return;
        }

        this.board.innerHTML = '';
        this.cells = [];

        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.onCellClick(i));
            this.board.appendChild(cell);
            this.cells.push(cell);
        }
        console.log('Created', this.cells.length, 'cells');
    }

    createGoblin() {
        this.goblinElement = document.createElement('img');
        this.goblinElement.src = goblinImage;
        this.goblinElement.classList.add('goblin');
        this.goblinElement.alt = 'Goblin';
        this.goblinElement.style.width = '100%';
        this.goblinElement.style.height = '100%';
        this.goblinElement.style.objectFit = 'cover';
        this.goblinElement.style.borderRadius = '8px';

        this.goblinElement.onload = () => console.log('Goblin image loaded');
        this.goblinElement.onerror = () => console.error('Failed to load goblin image');
    }

    startGame() {
        setTimeout(() => {
            if (!this.isGameOver && this.cells.length > 0) {
                this.moveGoblin();
            }
        }, 500);

        this.intervalId = setInterval(() => {
            if (!this.isGameOver && this.cells.length > 0) {
                this.moveGoblin();
            }
        }, 1000);
    }

    moveGoblin() {
        if (this.cells.length === 0) return;

        const newPosition = this.getRandomPosition();

        if (this.currentPosition !== null) {
            this.removeGoblinFromCell(this.currentPosition);
        }

        this.placeGoblinInCell(newPosition);
        this.currentPosition = newPosition;
    }

    getRandomPosition() {
        let newPosition;
        do {
            newPosition = Math.floor(Math.random() * this.cells.length);
        } while (newPosition === this.currentPosition && this.cells.length > 1);
        return newPosition;
    }

    placeGoblinInCell(position) {
        if (this.cells[position] && this.goblinElement) {
            while (this.cells[position].firstChild) {
                this.cells[position].removeChild(this.cells[position].firstChild);
            }
            this.cells[position].appendChild(this.goblinElement);
        }
    }

    removeGoblinFromCell(position) {
        if (this.cells[position] && this.cells[position].contains(this.goblinElement)) {
            this.cells[position].removeChild(this.goblinElement);
        }
    }

    onCellClick(position) {
        if (this.isGameOver) return;

        if (position === this.currentPosition) {
            this.hitCount++;
            this.moveGoblin();
        } else {
            this.missCount++;
        }

        this.updateScore();

        if (this.missCount >= 5) {
            this.gameOver();
        }
    }

    updateScore() {
        const hitElement = document.getElementById('hit-count');
        const missElement = document.getElementById('miss-count');
        if (hitElement) hitElement.textContent = this.hitCount;
        if (missElement) missElement.textContent = this.missCount;
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.intervalId);
        alert(`Игра окончена! Вы поймали ${this.hitCount} гномов, пропустили ${this.missCount}`);
    }
}

module.exports = GoblinGame;