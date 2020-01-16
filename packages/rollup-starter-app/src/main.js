import {startGame, initializeGameControllerWithTicTacToe} from 'tic-tac-toe-board-example';
import css from './index.scss';

window.addEventListener('DOMContentLoaded', (event) => {
  createGameBoard();

  const board = document.querySelector('#tic-tac-toe-board');

  if (!board) {
    throw new Error('Missing board');
  }

  board.classList.add(css.ticTacToeBoard);

  let positions, playNextTurn, currentPlayersTurnIndex;
  ({playNextTurn, positions, currentPlayersTurnIndex} = startGame());

  function setupClickListeners({onBoardPositionClicked, onNewGameClicked}) {

    const handleBoardClick = (event) => {
      
      if (event.target.tagName !== 'BUTTON') {
        return;
      }

      const siblings = Array.from(event.target.parentElement.children);
      const indexOfButton = siblings.indexOf(event.target);
      const columnIndex = indexOfButton % 3;
      const rowIndex = Math.floor(indexOfButton / 3);

      onBoardPositionClicked({rowIndex, columnIndex});

    };
    board.addEventListener('click', handleBoardClick)

    document.querySelector('#new-game-button').addEventListener('click', onNewGameClicked);

    return () => {

      board.removeEventListener('click', handleBoardClick);
      document.querySelector('#new-game-button').removeEventListener('click', onNewGameClicked);
    }

  }

  function createGameBoard(size = 3) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add(css.gameContainer)

    gameBoardContainer.innerHTML = `
    <h1 class=${css.gameTitle}>Tic Tac Toe</h1>
    <div id='tic-tac-toe-board'>
    </div>
    <button id="new-game-button" class=${css.newGameButton}> New Game</button>
    <h2 id="game-state"></h2>
    `;

    for (let i = 0; i < size * size; i++) {
      const newButton = document.createElement('button');

      const columnIndex = i % 3;
      const rowIndex = Math.floor(i /3);

      newButton.setAttribute('aria-role', `Button at board-position ${rowIndex}, ${columnIndex}`)

      gameBoardContainer.querySelector('#tic-tac-toe-board').appendChild(newButton);
    }

    document.querySelector('body').appendChild(gameBoardContainer);
  }

  function formatBoard(gameState) {
    const gameStateLabel = document.querySelector('#game-state');

    if (gameState.winningPlayer) {
      gameStateLabel.classList.remove('hidden');

      const playerLabel = gameState.winningPlayer === 'PLAYER_0' ? 'Circle Player': 'X Player';
      gameStateLabel.textContent = `Congratulations to ${playerLabel}! Play again?`;
    } else if (gameState.isDraw) {
      gameStateLabel.textContent = `Draw! Play again?`;
      gameStateLabel.classList.remove('hidden');
    } else {
      gameStateLabel.classList.add('hidden');
      gameStateLabel.textContent = '';
    }
  }

  function formatBoardButton({
    rowIndex,
    columnIndex,
    position,
    gameOver
  }) {

    const indexOfButton = (3 * rowIndex) + columnIndex;
    const positionButton = board.children[indexOfButton];

    positionButton.classList.forEach(cssClass => {
      positionButton.classList.remove(cssClass);
    });

    positionButton.removeAttribute('disabled');

    if (position === null) {
    } else if (position === 'PLAYER_X') {
      positionButton.classList.add(css.player_x);
      positionButton.setAttribute('disabled', true);
      positionButton.setAttribute('aria-label', `X Player has placed a piece here`);
    } else if (position === 'PLAYER_0') {
      positionButton.classList.add(css.player_0);
      positionButton.setAttribute('disabled', true);
      positionButton.setAttribute('aria-label', `Circle Player has placed a piece here`);
    }

    if (gameOver) {
      positionButton.setAttribute('disabled', true);
    }

  }

  initializeGameControllerWithTicTacToe({
    setupClickListeners,
    formatBoard,
    formatBoardButton
  });
  
});

function startNewGameWithBoard({board, startGame}) {

}
