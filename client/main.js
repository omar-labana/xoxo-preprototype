// Socket Realted

const socket = io();

socket.on("setPlayer", (currPlayer) => (player = currPlayer));
socket.on("registerClick", (arr) => registerClickInGameState(arr));
socket.on("declareWinner", (s) => declareWinner(s));
// Sockets Playground

// Game Related
let gameState = {
  state: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
};

let player;
// Game Playground
const squareTargets = document.querySelectorAll(".square");

const addListeners = (targets) =>
  targets.forEach((target) => registerListener(target));

const registerListener = (elem) => {
  elem.addEventListener("click", registerClick);
};

const registerClick = (e) => {
  let id = getID_H(e);
  socket.emit("userClick", [id, player]);
};
const getID_H = (event) => event.target.id;
const registerClickInGameState = (arr) => {
  const xy = extractClickPosition(arr[0]);
  xy[0]--;
  xy[1]--;
  gameState.state[xy[0]][xy[1]] = player;
  drawShap(arr);
};
const extractClickPosition = (positionString) =>
  positionString.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {
    return +v;
  });

const drawShap = (arr) => {
  let symbol = document.createElement("img");
  symbol.setAttribute("src", `${arr[1].toLowerCase() + ".svg"}`);
  document.getElementById(arr[0]).appendChild(symbol);
  if (checkGameState()) {
    endGame(arr[1]);
    console.log("there is a winner");
  }
};

const checkGameState = () => {
  const game = [...gameState.state];
  for (let i = 0; i < game.length; i++) {
    if (
      checkWinner(game[0][i], game[1][i], game[2][i]) ||
      checkWinner(game[i][0], game[i][1], game[i][2])
    ) {
      return true;
    }
  }
  if (
    checkWinner(game[0][0], game[1][1], game[2][2]) ||
    checkWinner(game[0][2], game[1][1], game[2][0])
  ) {
    return true;
  }
  return false;
};
const checkWinner = (x, y, z) => x === y && y === z && z != "";
const endGame = (plat) => {
  removeListers();
  socket.emit("setWinner", plat);
};
const removeListers = () => {
  squareTargets.forEach((elem) => {
    removeLister(elem);
  });
};
const declareWinner = (winner) => {
  document.getElementsByClassName(
    "winner"
  )[0].innerHTML = `Player ${winner} won the Game`;
};
const removeLister = (elem) => elem.removeEventListener("click", registerClick);
// Main
const main = () => {
  addListeners(squareTargets);
};
main();
