
const PLAYER_0 = 'PLAYER_0';
const PLAYER_X = 'PLAYER_X';

const DEFAULT_GAME_BOARD_SIZE = 3;

export function initializeBoardPositions(size) {
    // create an sizexsize matrix
    const positions = new Array(size).fill(null)
    for (let i = 0; i < size; i++) {
      positions[i] = new Array(size).fill(null);
    }

    return positions;
}

export function allPositionsFromSinglePlayer(positionsArray) {
  const playerFromFirstPosition = positionsArray[0];

  for (let i = 1; i < positionsArray.length; i++) {
    if (positionsArray[i] !==playerFromFirstPosition) {
      return;
    }
  }

  return playerFromFirstPosition;
}


export function getTopLeftDiagonal(positions) {
  return positions.reduce((acc, row, index) => [...acc, row[index]], []);
}

export function getTopRightDiagonal(positions) {
  return positions.reduce((acc, row, index) => [...acc, row[positions.length - index - 1]], []);
}

export function getRow(positions, rowIndex) {
  return positions[rowIndex];
}

export function getColumn(positions, columnIndex) {
  return positions.reduce((acc, row) => [...acc, row[columnIndex]], []);

}

export function getWinningPlayer(positions) {

  let winningPlayer;
  const topLeftDiagonal = getTopLeftDiagonal(positions);

  winningPlayer = allPositionsFromSinglePlayer(topLeftDiagonal)
  if (winningPlayer) {
    return winningPlayer;
  }

  const topRightDiagonal = getTopRightDiagonal(positions);
  winningPlayer = allPositionsFromSinglePlayer(topRightDiagonal)
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
    winningPlayer = allPositionsFromSinglePlayer(getColumn(positions, columnIndex));
    if (winningPlayer) {
      return winningPlayer;
    }
  }
  
  return;
}

export function getNextPlayerIndex(currentPlayersTurn, players) {
  return currentPlayersTurn + 1 % players.length;
}

export function getPosition(positions, rowIndex, columnIndex) {
  return positions[rowIndex][columnIndex];
}

export function insertNewPositionIntoRow(row, columnIndex, positionValue) {
  return [...row.slice(0, columnIndex), positionValue, ...row.slice(columnIndex + 1)];
}

export function insertNewRowIntoPositions(row, rowIndex, positions) {
  return [...positions.slice(0, rowIndex), row, ...positions.slice(rowIndex + 1)];
}

export function allPositionsFilled(positions) {
  const size = positions.length;
  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    const nullPosition = getRow(positions, rowIndex).find((position) => position === null);

    if (nullPosition !== undefined) {
      return false;
    }
  }

  return true;
}

export function playNextTurn({rowIndex, columnIndex, positions, currentPlayersTurnIndex, players}) {
  if (getWinningPlayer(positions)) {
    throw new Error(`The game has already been won. Create a new game board`);
  }

  const position = getPosition(positions, rowIndex, columnIndex);

  if (position !== null) {
    throw new Error('Position has already been played')
  }

  const currentPlayer = players[currentPlayersTurnIndex];

  // don't mutate positions given as arg
  const replacementRow = insertNewPositionIntoRow(getRow(positions, rowIndex), columnIndex, currentPlayer);

  const newPositions = insertNewRowIntoPositions(replacementRow, rowIndex, positions)

  const nextPlayersTurnIndex = getNextPlayerIndex(currentPlayersTurnIndex, players);
  
  const winningPlayer = getWinningPlayer(newPositions)
  if (winningPlayer) {

    return {
      positions: newPositions,
      winningPlayer
    }
  }

  if (allPositionsFilled(newPositions)) {
    return {
      positions: newPositions,
      isDraw: true
    }
  }

  return {
    positions: newPositions,
    currentPlayersTurnIndex: nextPlayersTurnIndex
  }
}


export function startGame(gameParameters) {
  const {players, initialPositions, startingPlayerIndex} = initializeGameParameters(gameParameters);

  return {
    players,
    positions: initialPositions,
    currentPlayersTurnIndex: startingPlayerIndex,
    playNextTurn:  ({rowIndex, columnIndex}) => 
      playNextTurn({
        rowIndex, columnIndex,
        players,
        currentPlayersTurnIndex: startingPlayerIndex,
      })
  }

}

export function initializeGameParameters({players = [PLAYER_0, PLAYER_X], startingPlayerIndex = 0, initialPositions, size = DEFAULT_GAME_BOARD_SIZE} = {}) {

  return {
    players, startingPlayerIndex, size, initialPositions: initialPositions ||  initializeBoardPositions(size)
  };
}