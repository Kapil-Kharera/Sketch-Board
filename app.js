const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("public"));

const port = 5000 || process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});


const io = socket(server);

io.on("connection", (socket) => {
    //received data
    socket.on("beginPath", (data) => {
        //transfering data to all connected devices
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    });

    socket.on("undoRedo", (data) => {
        io.sockets.emit("undoRedo", data);
    })
});