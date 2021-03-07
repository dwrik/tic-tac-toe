// gameBoard module
const gameBoard = (() => {
    let _board;

    const getSquare = (x, y) => {
        return _board[x][y];
    };

    const setSquare = (x, y, value) => {
        _board[x][y] = value;
    };

    const isSquareOccupied = (x, y) => {
        return _board[x][y].length > 0;
    };

    const resetBoard = (event) => {
        if (event === undefined) return;
        _board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ];
    };

    const checkForWinner = () => {
        // horizontal
        for (let row=0; row<3; row++) {
            if (_board[row][0] !== '' &&
            _board[row][0] === _board[row][1] &&
            _board[row][0] === _board[row][2]) {
                return _board[row][0];
            }
        }

        // vertical
        for (let col=0; col<3; col++) {
            if (_board[0][col] !== '' &&
            _board[0][col] === _board[1][col] &&
            _board[0][col] === _board[2][col]) {
                return _board[0][col];
            }
        }

        // diagonals
        if (_board[0][0] !== '' && _board[0][0] === _board[1][1] && _board[0][0] === _board[2][2]) return _board[0][0];
        if (_board[0][2] !== '' && _board[0][2] === _board[1][1] && _board[0][2] === _board[2][0]) return _board[0][2];

        // no winner yet
        for (let row in _board) {
            for (let col in _board[row]) {
                if (_board[row][col] === '') {
                    return null;
                }
            }
        }

        // tie game
        return 'TIE';
    };

    return {
        getSquare,
        setSquare,
        resetBoard,
        isSquareOccupied,
        checkForWinner,
    };
})();


// Player factory
const Player = (playerName, playerToken) => {
    const _name = playerName;
    const _token = playerToken;

    const getName = () => _name;
    const getToken = () => _token;

    return { getName, getToken };
};


// displayController module
const displayController = (() => {

    const _boardElement = document.querySelector('.gameboard');
    const _resetButton = document.querySelector('#reset');
    const _playAgainButton = document.querySelector('#modal-button');

    _resetButton.addEventListener('click', (event) => game.resetGame(event));
    _playAgainButton.addEventListener('click', (event) => game.resetGame(event));

    const renderGameBoard = () => {
        _removeExistingBoard();
        for (let row=0; row<3; row++) {
            for (let col=0; col<3; col++) {
                const squareElement = _getSquareElement(
                    row,
                    col,
                    gameBoard.getSquare(row, col));
                _boardElement.appendChild(squareElement);
            }
        }
    };

    // helpers

    const _removeExistingBoard = () => {
        const boardSquares = [ ...document.querySelectorAll('.square') ];
        boardSquares.forEach((square) => _boardElement.removeChild(square));
    };

    const _getSquareElement = (row, col, value) => {
        const div = document.createElement('div');
        div.addEventListener('click', _handleClick);
        div.classList.add('square');
        div.id = `${row}-${col}`;
        div.innerHTML = value;
        return div;
    };

    const _handleClick = (event) => {
        const [ row, col ] = event.target.id.split('-');
        game.setPlay(row, col);
    };

    return { renderGameBoard };
})();


const game = (() => {

    const playerA = Player('Jim', 'X');
    const playerB = Player('Jon', 'O');

    let currPlayer;

    const resetGame = (event) => {
        if (event.target.id === 'modal-button') {
            _hideModal();
        }
        currPlayer = playerB;
        gameBoard.resetBoard(event);
        displayController.renderGameBoard();
    };

    const setPlay = (row, col) => {
        _swapPlayer();

        // if occupied undo the swap
        if (gameBoard.isSquareOccupied(row, col)) {
            _swapPlayer();
            return;
        }

        gameBoard.setSquare(row, col, currPlayer.getToken());
        displayController.renderGameBoard();

        const result = gameBoard.checkForWinner() ?? 'NONE';
        if (result === 'NONE') return;
        _gameOver(result);
    };

    const _gameOver = (winner) => {
        _setModalText(winner);
        _hideModal();
    };

    // private helpers

    const _setModalText = (winner) => {
        let resultText = '';

        if (winner === 'TIE') {
            resultText = `It's a ${winner}!`;
        } else {
            resultText = `Player ${winner} wins!`;
        }

        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = resultText;
    };

    const _hideModal = () => {
        const modal = document.querySelector('.modal');
        modal.classList.toggle('modal-hidden');
    };

    const _swapPlayer = () => {
        currPlayer = (currPlayer === playerB)? playerA : playerB;
    };

    return { resetGame, setPlay };
})();

// game can be reset with only game.resetGame which resets
// the entire gameboard, the display and the players. Event
// listener has been added to ensure that the gameboard cannot
// be reset from the console which only resets the board and not
// the display or the players
window.addEventListener('load', (event) => game.resetGame(event));