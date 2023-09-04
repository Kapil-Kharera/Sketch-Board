const canvasElement = document.querySelector("canvas");

canvasElement.width = window.innerWidth
canvasElement.height = window.innerHeight;

//API
const tool = canvasElement.getContext("2d");

//modification
tool.strokeStyle = "blue"; //color
tool.lineWidth = "5"; //size

tool.beginPath(); //new path (graphic)

tool.moveTo(10, 10); //start point
tool.lineTo(100, 150); // end point

//color fill
tool.stroke() 