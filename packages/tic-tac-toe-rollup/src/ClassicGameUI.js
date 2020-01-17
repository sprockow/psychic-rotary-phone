import css from './ClassicGameUI.scss';

export default function createGameUI({ size = 3 } = {}) {
  const gameContainer = createGameBoard({ size });

  const formatBoard = args => formatBoardWithinContainer(args, gameContainer);

  const formatBoardButton = args =>
    formatBoardButtonWithinContainer(args, gameContainer);

  const setupClickListeners = args =>
    setupClickListenersWithinContainer(args, gameContainer);

  return {
    gameContainer,
    formatBoard,
    formatBoardButton,
    setupClickListeners,
  };
}

export function createGameBoard({ size }) {
  const gameBoardContainer = document.createElement('div');
  gameBoardContainer.classList.add(css.gameContainer);

  gameBoardContainer.innerHTML = `
    <h1 class=${css.gameTitle}>Tic Tac Toe</h1>
    <div id='tic-tac-toe-board' class=${css.ticTacToeBoard}>
    </div>
    <button id="new-game-button" class=${css.newGameButton}> New Game</button>
    <h2 class=${css.gameStateLabel} id="game-state"></h2>
  `;

  for (let i = 0; i < size * size; i++) {
    const newButton = document.createElement('button');

    const columnIndex = i % 3;
    const rowIndex = Math.floor(i / 3);

    newButton.setAttribute(
      'aria-role',
      `Button at board-position ${rowIndex}, ${columnIndex}`,
    );

    gameBoardContainer
      .querySelector('#tic-tac-toe-board')
      .appendChild(newButton);
  }

  return gameBoardContainer;
}

export function getBoard({ gameContainer }) {
  return gameContainer.querySelector('#tic-tac-toe-board');
}

export function getNewGameButton({ gameContainer }) {
  return gameContainer.querySelector('#new-game-button');
}

export function getPositionButton({ rowIndex, columnIndex, gameContainer }) {
  const board = getBoard({ gameContainer });

  const indexOfButton = 3 * rowIndex + columnIndex;
  return board.children[indexOfButton];
}

export function getGameStateLabel({ gameContainer }) {
  return gameContainer.querySelector('#game-state');
}

export function createLabelForUser(player) {
  return player === 'PLAYER_0' ? 'Circle Player' : 'X Player';
}

export function formatBoardButtonWithinContainer(
  { rowIndex, columnIndex, position, gameOver },
  gameContainer,
) {
  const positionButton = getPositionButton({
    rowIndex,
    columnIndex,
    gameContainer,
  });

  positionButton.removeAttribute('disabled');

  positionButton.setAttribute('class', '');

  if (position === 'PLAYER_X') {
    positionButton.classList.add(css.player_x);
    positionButton.setAttribute('disabled', true);
    positionButton.setAttribute(
      'aria-label',
      `X Player has placed a piece here`,
    );
  } else if (position === 'PLAYER_0') {
    positionButton.classList.add(css.player_0);
    positionButton.setAttribute('disabled', true);
    positionButton.setAttribute(
      'aria-label',
      `Circle Player has placed a piece here`,
    );
  }

  if (gameOver) {
    positionButton.setAttribute('disabled', true);
  }
}

export function formatBoardWithinContainer(gameState, gameContainer) {
  const gameStateLabel = getGameStateLabel({ gameContainer });

  if (gameState.winningPlayer) {
    gameStateLabel.classList.remove('hidden');

    const playerLabel = createLabelForUser(gameState.winningPlayer);
    gameStateLabel.textContent = `Congratulations to ${playerLabel}! Play again?`;
    document.querySelector('#new-game-button').focus();
  } else if (gameState.isDraw) {
    gameStateLabel.textContent = `Draw! Play again?`;
    gameStateLabel.classList.remove('hidden');
    document.querySelector('#new-game-button').focus();
  } else {
    gameStateLabel.classList.add('hidden');
    gameStateLabel.textContent = '';
  }
}

export function getCoordinatesOfPositionButton(positionButton) {
  const siblings = Array.from(positionButton.parentElement.children);
  const indexOfButton = siblings.indexOf(positionButton);
  const columnIndex = indexOfButton % 3;
  const rowIndex = Math.floor(indexOfButton / 3);

  return {
    columnIndex,
    rowIndex,
  };
}

export function setupClickListenersWithinContainer(
  { onBoardPositionClicked, onNewGameClicked },
  gameContainer,
) {
  const board = getBoard({ gameContainer });

  const handleBoardClick = event => {
    if (event.target.tagName !== 'BUTTON') {
      return;
    }

    const { rowIndex, columnIndex } = getCoordinatesOfPositionButton(
      event.target,
    );

    onBoardPositionClicked({ rowIndex, columnIndex });
  };
  board.addEventListener('click', handleBoardClick);

  const newGameButton = getNewGameButton({ gameContainer });
  newGameButton.addEventListener('click', onNewGameClicked);

  return () => {
    board.removeEventListener('click', handleBoardClick);
    newGameButton.removeEventListener('click', onNewGameClicked);
  };
}
