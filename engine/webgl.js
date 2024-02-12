// Main webGL function

// Start when the page has loaded
window.onload = main;

var webGL;
var objects = [];

function main() {
  // Start webGL on the canvas
  const canvas = document.getElementById("webgl-canvas");
  var webGL = canvas.getContext("webgl");

  // Set a loading message
  const loadingMessage = document.getElementById("loading-message");
  loadingMessage.textContent = "Loading...";

  // Make sure webGL works
  if (webGL === null) {
    alert("Your machine or browser does not support webGL");
    return;
  }

  // Set the default color to black when cleared
  webGL.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear the canvas
  webGL.clear(webGL.COLOR_BUFFER_BIT);

  // Fullscreen the the canvas
  function fullscreenCanvas() {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullScreen) {
      canvas.webkitRequestFullScreen();
    }
    canvas.height = screen.height;
    canvas.width = screen.width;
    webGL.viewport(0, 0, canvas.width, canvas.height);
    canvas.onfullscreenchange = function() {
      if (!document.fullscreenElement) {
        canvas.height = 150;
        canvas.width = 300;
        webGL.viewport(0, 0, canvas.width, canvas.height);
      }
    };
  }

  // When the user clicks the fullscreen button, fullscreen the canvas
  var fullscreenButton = document.getElementById("fullscreen-button");
  fullscreenButton.addEventListener("click", fullscreenCanvas);

  var getShaders = new Promise(function(resolve) {
    var program = webGL.createProgram();
    var vertexPromise = fetch("shaders/vertex.glsl").then(function(response) {return response.text()});
    var fragmentPromise = fetch("shaders/fragment.glsl").then(function(response) {return response.text()});
    Promise.all([vertexPromise, fragmentPromise]).then(function(responses) {
      var vertexResponse = responses[0];
      var vshader = webGL.createShader(webGL.VERTEX_SHADER);
      webGL.shaderSource(vshader, vertexResponse);
      webGL.compileShader(vshader);
      webGL.attachShader(program, vshader);
      var fragmentResponse = responses[1];
      var fshader = webGL.createShader(webGL.FRAGMENT_SHADER);
      webGL.shaderSource(fshader, fragmentResponse);
      webGL.compileShader(fshader);
      webGL.attachShader(program, fshader);
      webGL.linkProgram(program);
      resolve(program);
    });
  });

  getShaders.then(function(shaders) {
    loadingMessage.textContent = "";
    setInterval(function() {frameUpdate(shaders)}, 16);
  });

  function frameUpdate(program) {
    if (objects.length > 0) {
      var allTriangles = [];
      var allColors = [];
      for (var i = 0; i < objects.length; i++) {
        objects[i].frameUpdate();
        allTriangles = allTriangles.concat(objects[i].shape.triangles.flat());
        allColors = allColors.concat(objects[i].shape.colors.flat());
      }

      // Clear the canvas
      webGL.clear(webGL.COLOR_BUFFER_BIT);
      var dimensions = 2;
      var itemNum = allTriangles.length / dimensions;

      // Make a buffer for the shape vertices
      var shapeBuffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, shapeBuffer);
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(allTriangles), webGL.STATIC_DRAW);

      // Make a buffer for the colors
      var colorBuffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, colorBuffer);
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(allColors), webGL.STATIC_DRAW);

      // Get the program ready
      webGL.useProgram(program);

      program.position = webGL.getAttribLocation(program, "position");
      webGL.bindBuffer(webGL.ARRAY_BUFFER, shapeBuffer);
      webGL.enableVertexAttribArray(program.position);
      webGL.vertexAttribPointer(program.position, dimensions, webGL.FLOAT, false, 0, 0);

      program.color = webGL.getAttribLocation(program, "color");
      webGL.bindBuffer(webGL.ARRAY_BUFFER, colorBuffer);
      webGL.enableVertexAttribArray(program.color);
      webGL.vertexAttribPointer(program.color, 4, webGL.FLOAT, false, 0, 0);

      // Draw it!
      webGL.drawArrays(webGL.TRIANGLES, 0, itemNum);
    }
  }
}
