//game related
let nextPlayer = "X"; //min
let changePlayer = (currPlayer) => (currPlayer === "X" ? "O" : "X");
let sendPlayer = () => {
  const currentPlayer = nextPlayer;
  nextPlayer = changePlayer(nextPlayer);
  return currentPlayer;
};
//server related
const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const server = app.listen(PORT, () =>
  console.log(`Eyes on port ${PORT} ` + "http://localhost:3000/")
);
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});
//Socket Logic
io.on("connection", (socket) => {
  socket.emit("setPlayer", sendPlayer());
  socket.on("userClick", (data) => {
    io.emit("registerClick", data);
  });
  socket.on("setWinner", (winner) => io.emit("declareWinner", winner));
});
//trash
