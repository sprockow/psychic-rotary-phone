import {startGame, initializeGameControllerWithTicTacToe} from 'tic-tac-toe-board-example';
import css from './index.scss';

window.addEventListener('DOMContentLoaded', (event) => {
  const board = document.querySelector('#tic-tac-toe-board');

  if (!board) {
    throw new Error('Missing board');
  }

  console.log({css})
  board.classList.add(css.ticTacToeBoard);

  let positions, playNextTurn, currentPlayersTurnIndex;
  ({playNextTurn, positions, currentPlayersTurnIndex} = startGame());

  function setupClickListeners({onBoardPositionClicked, onNewGameClicked}) {

    const handleBoardClick = (event) => {
      
      if (event.target.tagName !== 'BUTTON') {
        return;
      }

      const rowSiblings = Array.from(event.target.parentElement.children);
      const columnIndex = rowSiblings.indexOf(event.target);

      const parentSiblings = Array.from(event.target.parentElement.parentElement.children);

      const rowIndex = parentSiblings.indexOf(event.target.parentElement);

      onBoardPositionClicked({rowIndex, columnIndex});

    };
    board.addEventListener('click', handleBoardClick)

    document.querySelector('#new-game-button').addEventListener('click', onNewGameClicked);

    return () => {

      board.removeEventListener('click', handleBoardClick);
      document.querySelector('#new-game-button').removeEventListener('click', onNewGameClicked);
    }

  }

  function formatBoard(gameState) {

  }

  function formatBoardButton({
    rowIndex,
    columnIndex,
    position,
    gameOver
  }) {

    const row = board.children[rowIndex];
    const positionButton = row.children[columnIndex];

    positionButton.classList.forEach(cssClass => {
      positionButton.classList.remove(cssClass);
    });

    positionButton.removeAttribute('disabled');

    if (position === null) {
    } else if (position === 'PLAYER_X') {
      positionButton.classList.add(css.player_x);
      positionButton.setAttribute('disabled', true);
    } else if (position === 'PLAYER_0') {
      positionButton.classList.add(css.player_0);
      positionButton.setAttribute('disabled', true);
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
