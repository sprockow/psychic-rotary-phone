# Tic Tac Toe Library

Github library is purposely obscurley named for now, until the library is ready publishing...

## Getting started

This library could be hypothetically installed (once it is actually published to npm) by running:

`npm install --save tic-tac-toe-board-example`

To add a tic-tac-toe board component to your app:

```
  import launchTicTacToeBoard from 'tic-tac-toe-board-example';

  const {unsubscribeListeners} = launchTicTacToeBoard(document.querySelector('body'));

  //once finished playing, tear down listeners
  unsubscribeListeners();
```


## Getting started with the demo in this repo

Ensure you have lerna installed
`npm install -g lerna`

Then bootstrap the monorepo and download the dependencies for the two child projects using:
`lerna bootstrap`

First navigate to the library sub-project, and build the library
`npm run build`

At that point, navigate back to the roo and then to the including demo site:
`cd ./packages/rollup-starter-app`

and run

`npm run dev`

This will build the project, import the local tic-tac-toe-library and start a local server at `http://localhost:5000` . 

### Live changes for development

If you want to watch changes from the library sub-project and see the results immediately on screen, you'll need to start two processes. In the library project, run 

`npm run dev`

and in then in the rollup-starter-app

`npm run dev`

## Approach
### MVC approach
In order to build this library without the use of any other runtime dependencies (ie React), I wanted to be careful with how I organized the code and opted for a strict MVC approach. The UI rendering logic, the controller logic (attaching click listeners to call various callbacks), and the actual game mechanics are all seperate. 

### Functional practices

Furthermore, because I wanted to be very careful with how I tested the applications various mechanics, I tried to pursue as much of a functional programming approach as possible. Almost all functions are seperately testable and pure, in that they don't write to any outside state, and take in all of their state via arguments. One downside to relying heavily on passed in state, is that the other components that call functions need to have extensive knowledge of the large number of required arguments. In order to encapsulate and hide functionality between components, I relied heavily on currying functions. `startGame` is the best example of this, where an outside component like the `GameController` can simply call the returned `playNextTurn` function with nothing but the row/column coordinates. `playNextTurn` returns a curried copy of itself with the new game state already given as arguments. The controller can call the funtion over and over again until a winning or draw state is reached.

### Testing
The functional approach paid off in that I was able to write a large number of tests fairly easily without relying on lots of mocking.

I used jest for testing, (if only because I was most familiar with the technology because of its support for React). It should be familiar to anyone who has used Mocha or some other BDD type testing library. To run tests: `npx jest --watch`

### Extensibility

I wanted to write a library that provides but very easy to use (ie import and initiate with one line of code), but one that could also be easily customized. 

### Ease of use
In order to avoid forcing the developer to bring in additional css resources, I simply bundle the small amount of css with the js asset using css modules. The css classes are uniquely generated (plus are all scoped to the game container). 

There's a lot more I could probably do on this front to make extensibility/customization very easy, but the MVC approach does naturally allow for this without too much additional effort.

For example, let's say you wanted to create your own custome game board. You simply need to create your version of `createGameUI`. It needs to return a `formatBoard`, `formatBoardButton` and `setupClickListener` callback functions. Since you're no longer using prebundle css, you could simply use your application's own css tooling.

```
  const gameParameters = initializeGameParameters();

    const {
      setupClickListeners,
      formatBoard,
      formatBoardButton,
      gameContainer,
    } = myCustomeGameUI(gameParameters);

    rootElement.appendChild(gameContainer);

    const { unsubscribeListeners } = initializeGameController({
      gameParameters,
      startGame,
      setupClickListeners,
      formatBoard,
      formatBoardButton,
    });
  ```

  ### Other

  Opted to use buttons for the board, so that they are easily key navigable and accessible.


