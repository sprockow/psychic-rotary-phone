import startGame, * as ticTacUtils from './TicTacToeGame.js';
import initializeGameController, * as gameControllerUtils from './GameController';
import createGameUI from './ClassicGameUI';

const PLAYER_0 = 'PLAYER_0';
const PLAYER_X = 'PLAYER_X';

const DEFAULT_GAME_BOARD_SIZE = 3;

export function initializeGameParameters({
  players = [PLAYER_0, PLAYER_X],
  startingPlayerIndex = 0,
  initialPositions,
  size = DEFAULT_GAME_BOARD_SIZE,
} = {}) {
  return {
    players,
    startingPlayerIndex,
    size,
    initialPositions,
  };
}

export default function launchTicTacToeBoard(rootElement) {
  const gameParameters = initializeGameParameters();

  const {
    setupClickListeners,
    formatBoard,
    formatBoardButton,
    gameContainer,
  } = createGameUI(gameParameters);

  rootElement.appendChild(gameContainer);

  const { unsubscribeListeners } = initializeGameController({
    gameParameters,
    startGame,
    setupClickListeners,
    formatBoard,
    formatBoardButton,
  });

  return {
    gameContainer,
    unsubscribeListeners,
  };
}

launchTicTacToeBoard;

export {
  startGame,
  ticTacUtils,
  gameControllerUtils,
  initializeGameController,
  createGameUI,
};
