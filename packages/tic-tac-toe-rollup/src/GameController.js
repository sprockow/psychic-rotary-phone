// The controller is UI agnostic. It takes in a function to setup click listeners and functions to update the UI. It will handle the logic flow of translating UI events into game model updates which it will then pass back to the UI. It returns a method to unsubscribe the click listeners
export default function initializeGameController({
  startGame,
  formatBoardButton,
  formatBoard,
  setupClickListeners,
  gameParameters,
}) {
  let positions,
    isDraw,
    winningPlayer,
    playNextTurn,
    players,
    currentPlayersTurnIndex;

  ({ playNextTurn, players, positions, currentPlayersTurnIndex } = startGame(
    gameParameters,
  ));

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
    } = startGame(gameParameters));

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
