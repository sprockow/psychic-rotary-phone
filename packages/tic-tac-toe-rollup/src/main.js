import startGame, * as ticTacUtils from './TicTacToeGame.js';
import initializeGameController, * as gameControllerUtils from './GameController';
import createGameUI from './GameUI';

export default function launchTicTacToeBoard(rootElement) {
  const {
    setupClickListeners,
    formatBoard,
    formatBoardButton,
    gameContainer,
  } = createGameUI();

  rootElement.appendChild(gameContainer);

  initializeGameController({
    startGame,
    setupClickListeners,
    formatBoard,
    formatBoardButton,
  });
}

launchTicTacToeBoard;

export {
  startGame,
  ticTacUtils,
  gameControllerUtils,
  initializeGameController,
  createGameUI,
};
