const {TicTacToeBoard, ticTacUtils} = require('..');

describe('TicTacToeBoard', () => {
	describe('basic utils', () => {
		const samplePositions = [
			[null, null, 'PLAYER_X'],
			[null, 'PLAYER_0', null],
			[null, 'PLAYER_X', 'PLAYER_0']
		]
	
		it('can getRow', () => {
			expect(ticTacUtils.getRow(samplePositions, 0)).toEqual([null, null, 'PLAYER_X'])
		})
	
		it('can getColumn', () => {
			expect(ticTacUtils.getColumn(samplePositions, 1)).toEqual([null, 'PLAYER_0', 'PLAYER_X'])
		})
	
		it('can get top right diagonal', () => {
			expect(ticTacUtils.getTopRightDiagonal(samplePositions)).toEqual(['PLAYER_X', 'PLAYER_0', null])
		})
	
		it('can get top left diagonal', () => {
			expect(ticTacUtils.getTopLeftDiagonal(samplePositions)).toEqual([null, 'PLAYER_0', 'PLAYER_0'])
		})

		it('can check all positions and detect full board', () => {
			const notFullBoard = [
				[null, null, 'PLAYER_X'],
				[null, 'PLAYER_0', null],
				[null, 'PLAYER_X', 'PLAYER_0']
			]

			const fullBoard = [
				['PLAYER_X', 'PLAYER_X', 'PLAYER_X'],
				['PLAYER_X', 'PLAYER_X', 'PLAYER_X'],
				['PLAYER_X', 'PLAYER_X', 'PLAYER_X']
			]

			expect(ticTacUtils.allPositionsFilled(fullBoard)).toEqual(true);
			expect(ticTacUtils.allPositionsFilled(notFullBoard)).toEqual(false);
		});

		describe('not mutating board positions', () => {
			it('can create a copy of a row with a new position value', () => {
				const row = ['PLAYER_X', 'PLAYER_X', 'PLAYER_X'];
				const replacementRow = ticTacUtils.insertNewPositionIntoRow(row, 0, 'PLAYER_0');
	
				expect(replacementRow).toEqual(['PLAYER_0', 'PLAYER_X', 'PLAYER_X'])
				
			})
	
			it('can create a copy of a row with a new position value', () => {
				const row = ['PLAYER_X', 'PLAYER_X', 'PLAYER_X'];
				const replacementRow = ticTacUtils.insertNewPositionIntoRow(row, 0, 'PLAYER_X');
				
				expect(replacementRow).not.toBe(row);
			})

			it('can create an copy of the board with a new row', () => {
				const samplePositions = [
					[null, null, 'PLAYER_X'],
					[null, 'PLAYER_0', null],
					[null, 'PLAYER_X', 'PLAYER_0']
				]

				const newPositions = ticTacUtils.insertNewRowIntoPositions([null, 'PLAYER_X', 'PLAYER_X'], 0, samplePositions)

				expect(newPositions).toEqual(

					[
						[null, 'PLAYER_X', 'PLAYER_X'],
						[null, 'PLAYER_0', null],
						[null, 'PLAYER_X', 'PLAYER_0']
					]
				)
			})

		});

	});

	describe('can calculate winning player', () => {

		it ('returns undefined when no one has won', () => {
			const nonWinningBoard = [
				[null, null, 'PLAYER_X'],
				[null, 'PLAYER_0', null],
				[null, 'PLAYER_X', 'PLAYER_0']
			];

			expect(ticTacUtils.getWinningPlayer(nonWinningBoard)).toEqual(undefined)
		});

		it('returns PLAYER_0 for diagonal win', () => {
			const winningDiagonalBoard = [
				['PLAYER_0', null, 'PLAYER_X'],
				[null, 'PLAYER_0', null],
				[null, 'PLAYER_X', 'PLAYER_0']
			];

			expect(ticTacUtils.getWinningPlayer(winningDiagonalBoard)).toEqual('PLAYER_0')
		})

		it('returns PLAYER_0 for winningRowBoard', () => {

			const winningRowBoard = [
				['PLAYER_0', 'PLAYER_0', 'PLAYER_0'],
				[null, 'PLAYER_0', null],
				[null, 'PLAYER_X', 'PLAYER_0']
			];

			expect(ticTacUtils.getWinningPlayer(winningRowBoard)).toEqual('PLAYER_0')
		})


		it('returns PLAYER_X for winningColumnBoard', () => {

			const winningColumnBoard = [
				['PLAYER_0', null, 'PLAYER_X'],
				[null, 'PLAYER_0', 'PLAYER_X'],
				[null, 'PLAYER_X', 'PLAYER_X']
			];

			expect(ticTacUtils.getWinningPlayer(winningColumnBoard)).toEqual('PLAYER_X')
		})

	});
	
	describe('initializes game parameters with defaults', () => {

		it ('initializes with no overrides', () => {
			const gameboard = ticTacUtils.initializeGameParameters()
			expect(gameboard.initialPositions.length).toEqual(3);
			expect(gameboard.players.length).toEqual(2);
			expect(gameboard.startingPlayerIndex).toEqual(0);
			expect(gameboard.initialPositions).toEqual(expect.arrayContaining([[null, null, null], [null, null, null], [null, null, null]]))
		})
		
	});

	describe('play next turn', () => {

		const nonWinningBoard = [
			[null, null, 'PLAYER_X'],
			[null, 'PLAYER_0', null],
			[null, 'PLAYER_X', 'PLAYER_0']
		];

		const players = ['PLAYER_0', 'PLAYER_X'];

		it('when not a draw or win returns positions and player index', () => {
			const results = ticTacUtils.playNextTurn({
				positions: nonWinningBoard,
				currentPlayersTurnIndex: 0,
				players,
				rowIndex: 0,
				columnIndex: 1
			});

			expect(results.positions).toEqual([
				[null, 'PLAYER_0', 'PLAYER_X'],
				[null, 'PLAYER_0', null],
				[null, 'PLAYER_X', 'PLAYER_0']
			]);

			expect(results.currentPlayersTurnIndex).toEqual(1);

			expect(results.isDraw).toEqual(undefined);
			expect(results.winningPlayer).toEqual(undefined)

		});

		it('when player wins, returns positions and winning player', () => {
			const results = ticTacUtils.playNextTurn({
				positions: nonWinningBoard,
				currentPlayersTurnIndex: 0,
				players,
				rowIndex: 0,
				columnIndex: 0
			});

			expect(results.positions).toEqual([
				['PLAYER_0', null, 'PLAYER_X'],
				[null, 'PLAYER_0', null],
				[null, 'PLAYER_X', 'PLAYER_0']
			]);

			expect(results.currentPlayersTurnIndex).toEqual(undefined);

			expect(results.isDraw).toEqual(undefined);
			expect(results.winningPlayer).toEqual('PLAYER_0')

		});

		it('when players draw, returns positions and isDraw', () => {
			const almostDraw = [
				['PLAYER_X', 'PLAYER_0', 'PLAYER_X'],
				['PLAYER_X', 'PLAYER_0', 'PLAYER_X'],
				[null, 'PLAYER_X', 'PLAYER_0']
			];

			const results = ticTacUtils.playNextTurn({
				positions: almostDraw,
				currentPlayersTurnIndex: 0,
				players,
				rowIndex: 2,
				columnIndex: 0
			});

			expect(results.positions).toEqual([
				['PLAYER_X', 'PLAYER_0', 'PLAYER_X'],
				['PLAYER_X', 'PLAYER_0', 'PLAYER_X'],
				['PLAYER_0', 'PLAYER_X', 'PLAYER_0']
			]);

			expect(results.currentPlayersTurnIndex).toEqual(undefined);

			expect(results.isDraw).toEqual(true);
			expect(results.winningPlayer).toEqual(undefined)

		});
	})

	describe('start game', () => {
		it('calling start game with no overrides', () => {
			let positions, playNextTurn, currentPlayersTurnIndex;

			({playNextTurn, positions, currentPlayersTurnIndex} = ticTacUtils.startGame());

			expect(positions).toEqual([[null, null, null], [null, null, null], [null, null, null]])

			expect(currentPlayersTurnIndex).toEqual(0);

			({positions, currentPlayersTurnIndex, playNextTurn} = playNextTurn({
				rowIndex: 0,
				columnIndex: 0
			}));

			expect(positions).toEqual([['PLAYER_0', null, null], [null, null, null], [null, null, null]]);
			expect(currentPlayersTurnIndex).toEqual(1);

			({positions, currentPlayersTurnIndex, playNextTurn} = playNextTurn({
				rowIndex: 0,
				columnIndex: 1
			}));

			expect(positions).toEqual([['PLAYER_0', 'PLAYER_X', null], [null, null, null], [null, null, null]]);
			expect(currentPlayersTurnIndex).toEqual(0);

			({positions, currentPlayersTurnIndex, playNextTurn} = playNextTurn({
				rowIndex: 1,
				columnIndex: 0
			}));

			expect(positions).toEqual([['PLAYER_0', 'PLAYER_X', null], ['PLAYER_0', null, null], [null, null, null]]);
			expect(currentPlayersTurnIndex).toEqual(1);

			({positions, currentPlayersTurnIndex, playNextTurn} = playNextTurn({
				rowIndex: 0,
				columnIndex: 2
			}));

			expect(positions).toEqual([['PLAYER_0', 'PLAYER_X', 'PLAYER_X'], ['PLAYER_0', null, null], [null, null, null]]);
			expect(currentPlayersTurnIndex).toEqual(0);

			const finalResults = playNextTurn({
				rowIndex: 2,
				columnIndex: 0
			});

			expect(finalResults.positions).toEqual([['PLAYER_0', 'PLAYER_X', 'PLAYER_X'], ['PLAYER_0', null, null], ['PLAYER_0', null, null]]);
			
			expect(finalResults.winningPlayer).toEqual('PLAYER_0')
		})
	})
})