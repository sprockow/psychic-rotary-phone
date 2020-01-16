import {startGame, initializeGameControllerWithTicTacToe} from 'tic-tac-toe-board-example';

window.addEventListener('DOMContentLoaded', (event) => {
  const board = document.querySelector('#tic-tac-toe-board');

  if (!board) {
    throw new Error('Missing board');
  }


  let positions, playNextTurn, currentPlayersTurnIndex;
  ({playNextTurn, positions, currentPlayersTurnIndex} = startGame());

  function setupClickListeners({onBoardPositionClicked, onNewGameClicked}) {
    board.addEventListener('click', (event) => {
      
      if (event.target.tagName !== 'BUTTON') {
        return;
      }

      const rowSiblings = Array.from(event.target.parentElement.children);
      const columnIndex = rowSiblings.indexOf(event.target);

      const parentSiblings = Array.from(event.target.parentElement.parentElement.children);

      const rowIndex = parentSiblings.indexOf(event.target.parentElement);

      onBoardPositionClicked({rowIndex, columnIndex});

    })

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

    if (position === null) {
      positionButton.textContent = '';
    } else if (position === 'PLAYER_X') {
      positionButton.textContent = 'X'
    } else if (position === 'PLAYER_0') {
      positionButton.textContent = '0'
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
