const { initializeGameController } = require('../dist/how-long-till-lunch.cjs');

describe('game controller', () => {
  it('calls startGame and setupClickListeners', () => {
    const positions = [
      [null, null, 'PLAYER_X'],
      [null, 'PLAYER_0', null],
      [null, 'PLAYER_X', 'PLAYER_0'],
    ];
    const currentPlayersTurnIndex = 0;
    const isDraw = undefined;
    const winningPlayer = undefined;
    const players = [];

    const playNextTurn = jest.fn(() => ({
      playNextTurn,
      positions,
      currentPlayersTurnIndex,
      isDraw,
      winningPlayer,
    }));

    const startGame = jest.fn(() => ({
      playNextTurn,
      positions,
      currentPlayersTurnIndex,
      isDraw,
      winningPlayer,
      players,
    }));

    const setupClickListeners = jest.fn(args => () => {});

    const formatBoard = jest.fn();
    const formatBoardButton = jest.fn();

    const results = initializeGameController({
      startGame,
      setupClickListeners,
      formatBoard,
      formatBoardButton,
    });

    expect(startGame.mock.calls.length).toEqual(1);
    expect(setupClickListeners.mock.calls.length).toEqual(1);
    expect(results.unsubscribeListeners).toBeTruthy();

    let onBoardPositionClicked, onNewGameClicked;
    ({
      onBoardPositionClicked,
      onNewGameClicked,
    } = setupClickListeners.mock.calls[0][0]);

    onBoardPositionClicked({
      rowIndex: 0,
      columnIndex: 0,
    });

    expect(formatBoard.mock.calls.length).toEqual(1);

    expect(formatBoardButton.mock.calls.length).toEqual(9);
    expect(formatBoardButton.mock.calls[0][0]).toEqual({
      rowIndex: 0,
      columnIndex: 0,
      position: null,
      gameOver: undefined,
    });
  });
});
