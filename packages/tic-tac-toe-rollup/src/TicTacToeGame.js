// default export. This can be used to start a new game. It will return a curried playNextTurn function that can be used to play the first turn. Each time playNextTurn is called, it returns the new game state and a curried copy of itself which can be used to play the next turn. playNextTurn can be called until the game is in a draw or winning state.
export default function startGame({
  players,
  initialPositions,
  startingPlayerIndex,
  size,
}) {
  const positions = initialPositions || initializeBoardPositions(size);

  return {
    players,
    positions,
    currentPlayersTurnIndex: startingPlayerIndex,
    playNextTurn: ({ rowIndex, columnIndex }) =>
      playNextTurn({
        rowIndex,
        columnIndex,
        players,
        currentPlayersTurnIndex: startingPlayerIndex,
        positions,
      }),
  };
}

// create an sizexsize matrix of null values
export function initializeBoardPositions(size) {
  const positions = new Array(size).fill(null);
  for (let i = 0; i < size; i++) {
    positions[i] = new Array(size).fill(null);
  }

  return positions;
}

// This will be used to check if all given positions are from a single player
export function allPositionsFromSinglePlayer(positionsArray) {
  const playerFromFirstPosition = positionsArray[0];

  for (let i = 1; i < positionsArray.length; i++) {
    if (positionsArray[i] !== playerFromFirstPosition) {
      return;
    }
  }

  return playerFromFirstPosition;
}

// The following helper methods will be use to get rows, columns diagonals

export function getTopLeftDiagonal(positions) {
  return positions.reduce((acc, row, index) => [...acc, row[index]], []);
}

export function getTopRightDiagonal(positions) {
  return positions.reduce(
    (acc, row, index) => [...acc, row[positions.length - index - 1]],
    [],
  );
}

export function getRow(positions, rowIndex) {
  return positions[rowIndex];
}

export function getColumn(positions, columnIndex) {
  return positions.reduce((acc, row) => [...acc, row[columnIndex]], []);
}

// This function will use the above helper methods and the allPositionsFromSinglePlayer to calculate whether the board has a new winning player
export function getWinningPlayer(positions) {
  let winningPlayer;
  const topLeftDiagonal = getTopLeftDiagonal(positions);

  winningPlayer = allPositionsFromSinglePlayer(topLeftDiagonal);
  if (winningPlayer) {
    return winningPlayer;
  }

  const topRightDiagonal = getTopRightDiagonal(positions);
  winningPlayer = allPositionsFromSinglePlayer(topRightDiagonal);
  if (winningPlayer) {
    return winningPlayer;
  }

  const size = positions.length;
  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    winningPlayer = allPositionsFromSinglePlayer(getRow(positions, rowIndex));
    if (winningPlayer) {
      return winningPlayer;
    }
  }

  for (let columnIndex = 0; columnIndex < size; columnIndex++) {
    winningPlayer = allPositionsFromSinglePlayer(
      getColumn(positions, columnIndex),
    );
    if (winningPlayer) {
      return winningPlayer;
    }
  }

  return;
}

// increments player index, but wraps around back to 0
export function getNextPlayerIndex(currentPlayersTurn, players) {
  return (currentPlayersTurn + 1) % players.length;
}

export function getPosition(positions, rowIndex, columnIndex) {
  return positions[rowIndex][columnIndex];
}

// The following two helper methods are use to create a copy of the existing positions matrix, so that we can avoid mutating the previous matrix
export function insertNewPositionIntoRow(row, columnIndex, positionValue) {
  return [
    ...row.slice(0, columnIndex),
    positionValue,
    ...row.slice(columnIndex + 1),
  ];
}

export function insertNewRowIntoPositions(row, rowIndex, positions) {
  return [
    ...positions.slice(0, rowIndex),
    row,
    ...positions.slice(rowIndex + 1),
  ];
}

// This method is used to determine whether all positions are filled. This is useful, because if there is no winning player, then the game must be a draw
export function allPositionsFilled(positions) {
  const size = positions.length;
  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    const nullPosition = getRow(positions, rowIndex).find(
      position => position === null,
    );

    if (nullPosition !== undefined) {
      return false;
    }
  }

  return true;
}

// This function will take in the current game state and the requested move coordinates. It will play the move and then returns the new gamestate along with a curried playNextTurn function that can be called again.
export function playNextTurn({
  rowIndex,
  columnIndex,
  positions,
  currentPlayersTurnIndex,
  players,
}) {
  if (getWinningPlayer(positions)) {
    throw new Error(`The game has already been won. Create a new game board`);
  }

  const position = getPosition(positions, rowIndex, columnIndex);

  if (position !== null) {
    throw new Error('Position has already been played');
  }

  const currentPlayer = players[currentPlayersTurnIndex];

  // don't mutate positions given as arg
  const replacementRow = insertNewPositionIntoRow(
    getRow(positions, rowIndex),
    columnIndex,
    currentPlayer,
  );

  const newPositions = insertNewRowIntoPositions(
    replacementRow,
    rowIndex,
    positions,
  );

  const nextPlayersTurnIndex = getNextPlayerIndex(
    currentPlayersTurnIndex,
    players,
  );

  const winningPlayer = getWinningPlayer(newPositions);
  if (winningPlayer) {
    return {
      positions: newPositions,
      winningPlayer,
    };
  }

  if (allPositionsFilled(newPositions)) {
    return {
      positions: newPositions,
      isDraw: true,
    };
  }

  return {
    positions: newPositions,
    currentPlayersTurnIndex: nextPlayersTurnIndex,
    playNextTurn: ({ rowIndex, columnIndex }) =>
      playNextTurn({
        rowIndex,
        columnIndex,
        players,
        currentPlayersTurnIndex: nextPlayersTurnIndex,
        positions: newPositions,
      }),
  };
}
