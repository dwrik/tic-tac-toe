const gameBoard = (() => {
    let _board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const getSquare = (x, y) => {
        return _board[x][y];
    };

    const setSquare = (x, y, value) => {
        if (_board[x][y] !== ' ') return;
        _board[x][y] = value;
    };

    const isSquareOccupied = (x, y) => {
        return _board[x][y].length > 0;
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
        return 'tie';
    };

    return { getSquare, setSquare, isSquareOccupied, checkForWinner };
})();

const displayController = ((firstPlayer, secondPlayer) => {
    const _playerA = firstPlayer;
    const _playerB = secondPlayer;
    const _boardElement = document.querySelector('.gameboard');

    // render board from array in gameboard module
    const renderGameBoard = () => {
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

    // private helper
    const _getSquareElement = (row, col, value) => {
        const div = document.createElement('div');
        // div.addEventListener('click', playerPlays);
        div.classList.add('square');
        div.id = `${row}-${col}`;
        div.innerHTML = value;
        return div;
    }

    /*
    const play = () => {
        while (gameboard.checkForWinner() === null) {
        }
    };
    */

    return { renderGameBoard };

})();

const Player = (playerName, playerToken) => {
    const name = playerName;
    const token = playerToken;
    const getName = () => name;
    const getToken = () => token;
};

displayController.renderGameBoard();