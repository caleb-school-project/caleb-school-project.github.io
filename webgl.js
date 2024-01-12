// Main webGL function

// Start when the page has loaded
window.onload = main;

var webGL;

function main() {
  // Start webGL on the canvas
  const canvas = document.getElementById("webgl-canvas");
  webGL = canvas.getContext("webgl");

  // Make sure webGL works
  if (webGL === null) {
    alert("Your machine or browser does not support webGL");
    return;
  }

  // Set the default color to blue when cleared
  webGL.clearColor(0.0, 0.0, 1.0, 1.0);

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
  }

  // When the user clicks the fullscreen button, fullscreen the canvas
  var fullscreenButton = document.getElementById("fullscreen-button");
  fullscreenButton.addEventListener("click", fullscreenCanvas);

  var getShaders = new Promise(function(resolve) {
    var program = webGL.createProgram();
    var vertexPromise = fetch("vertex.glsl");
    var fragmentPromise = fetch("fragment.glsl");
    Promise.all([vertexPromise, fragmentPromise]).then(function(responses) {
      var vertexResponse = responses[0].text();
      var vshader = webGL.createShader(webGL.VERTEX_SHADER);
      webGL.shaderSource(vshader, vertexResponse);
      webGL.compileShader(vshader);
      webGL.attachShader(program, vshader);
      var fragmentResponse = responses[1].text();
      var fshader = webGL.createShader(webGL.FRAGMENT_SHADER);
      webGL.shaderSource(fshader, fragmentResponse);
      webGL.compileShader(fshader);
      webGL.attachShader(program, fshader);
      webGL.linkProgram(program);
      resolve(program)
    });
  });

  getShaders.then(function(program) {

    // Start the game
    setInterval(function() {frameUpdate(program)}, 1000);
  });

  function frameUpdate(program) {
    squareVertices = new Float32Array([
      -0.5, 0.5, -0.5, -0.5, 0.5, -0.5
      -0.5, 0.5, 0.5, 0.5, 0.5, -0.5
    ]);
    var dimensions = 2;
    var itemNum = squareVertices.length / dimensions;

    // Make a buffer for the square
    squareBuffer = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, squareBuffer);
    webGL.bufferData(webGL.ARRAY_BUFFER, squareVertices, webGL.STATIC_DRAW);

    // Get the program ready
    webGL.useProgram(program);
    program.position = webGL.getAttribLocation(program, "position");
    webGL.enableVertexAttribArray(program.position);
    webGL.vertexAttribPointer(program.position, dimensions, webGL.FLOAT, false, 0, 0);

    // Draw it!
    webGL.drawArrays(webGL.TRIANGLES, 0, itemNum);
  }
}
