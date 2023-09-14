// const { socket } = require("engine.io");

const canvasElement = document.querySelector("canvas");

canvasElement.width = window.innerWidth
canvasElement.height = window.innerHeight;

//selectors
const pencilAllColorsElement = document.querySelectorAll(".pencil-color");
const pencilWidthElement = document.querySelector(".pencil-width");
const eraserWidthElement = document.querySelector(".eraser-width");
const downloadToolElement = document.querySelector("#download");
const redoToolElement = document.querySelector("#redo");
const undoToolElement = document.querySelector("#undo");

let mousedown = false;
let pencilColor = "red";
let eraserColor = "white";
let pencilWidth = pencilWidthElement.value;
let eraserWidth = eraserWidthElement.value;

let undoRedoTracker = []; //data
let track = 0; //represent which action (from tracker array)

//API
const tool = canvasElement.getContext("2d");

//modification
tool.strokeStyle = pencilColor; //color
tool.lineWidth = pencilWidth; //size

// tool.beginPath(); //new path (graphic)

// tool.moveTo(10, 10); //start point
// tool.lineTo(100, 150); // end point

//color fill
// tool.stroke() 

//mousedown -> start new path, mousemove -> path fill (graphics)
canvasElement.addEventListener("mousedown", (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // });
    const data = {
        x: e.clientX,
        y: e.clientY
    }

    socket.emit("beginPath", data);
});

canvasElement.addEventListener("mousemove", (e) => {

    if (mousedown) {

        const data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        }

        socket.emit("drawStroke", data);
    }

});

canvasElement.addEventListener("mouseup", (e) => {
    mousedown = false;

    const url = canvasElement.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

undoToolElement.addEventListener("click", () => {
    if (track > 0) track--;

    const data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("undoRedo", data);

    //action
    // undoRedoCanvas(trackObj);
});

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    const url = undoRedoTracker[track];

    const img = new Image(); //new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
    }
}

redoToolElement.addEventListener("click", () => {
    if (track < undoRedoTracker.length - 1) track++;

    const trackObj = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit("undoRedo", data);

    //action
    // undoRedoCanvas(trackObj);
});

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilAllColorsElement.forEach((colorElement) => {
    colorElement.addEventListener("click", (e) => {
        let color = colorElement.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
});

pencilWidthElement.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElement.value;
    tool.lineWidth = pencilWidth;
});

eraserWidthElement.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElement.value;
    tool.lineWidth = eraserWidth;
});

eraserToolElement.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
});


downloadToolElement.addEventListener("click", (e) => {
    const url = canvasElement.toDataURL();

    const a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

//socket
socket.on("beginPath", (data) => {
    //data -> which shared by server to all devices(which ultimately send by us)
    beginPath(data);
});


socket.on("drawStroke", (data) => {
    drawStroke(data);
});


socket.on("undoRedo", (data) => {
    undoRedoCanvas(data);
})
