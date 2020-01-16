export default function initializeGameController({
  startGame,
  formatBoardButton,
  formatBoard,
  setupClickListeners,
}) {
  let positions,
    isDraw,
    winningPlayer,
    playNextTurn,
    players,
    currentPlayersTurnIndex;

  ({ playNextTurn, players, positions, currentPlayersTurnIndex } = startGame());

  function onBoardPositionClicked({ rowIndex, columnIndex }) {
    ({
      playNextTurn,
      positions,
      currentPlayersTurnIndex,
      isDraw,
      winningPlayer,
    } = playNextTurn({
      rowIndex,
      columnIndex,
    }));

    render({
      formatBoardButton,
      formatBoard,
      positions,
      isDraw,
      winningPlayer,
      currentPlayersTurnIndex,
      players,
    });
  }

  function onNewGameClicked() {
    ({
      playNextTurn,
      positions,
      currentPlayersTurnIndex,
      isDraw,
      winningPlayer,
    } = startGame());

    render();
  }

  const unsubscribeListeners = setupClickListeners({
    onBoardPositionClicked,
    onNewGameClicked,
  });

  return {
    unsubscribeListeners,
  };
}

export function render({
  positions,
  formatBoard,
  formatBoardButton,
  currentPlayersTurnIndex,
  players,
  winningPlayer,
  isDraw,
}) {
  formatBoard({
    currentPlayersTurnIndex,
    isDraw,
    winningPlayer,
    players,
  });

  positions.forEach((row, rowIndex) => {
    row.forEach((position, columnIndex) => {
      formatBoardButton({
        rowIndex,
        columnIndex,
        position,
        gameOver: isDraw || winningPlayer,
      });
    });
  });
}
