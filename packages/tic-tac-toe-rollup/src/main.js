import startGame, * as ticTacUtils from './TicTacToeGame.js';
import initializeGameController, * as gameControllerUtils from './GameController';

function initializeGameControllerWithTicTacToe(args) {
  return initializeGameController({
    startGame,
    ...args,
  });
}

export {
  startGame,
  ticTacUtils,
  gameControllerUtils,
  initializeGameControllerWithTicTacToe,
  initializeGameController,
};
