// Main webGL function

function getFile(file) {
  xhr = new XMLHttpRequest();
  xhr.open("GET", file, false);
  xhr.onLoad = function() {
    return xhr.responseText;
  }
  xhr.send();
}

function createShader(webgl, source, type) {
  const shader = webgl.createShader(type);
  webgl.shaderSource(shader, source);
  webgl.compileShader(shader);
  return shader;
}

function drawSquare() {
  // Get the shaders
  xhr = new XMLHttpRequest();
  xhr.open("GET", "vertex.glsl", false);
  xhr.onreadystatechange = function() {
    if (this.readystate === 4 && this.status === 200) {
      var vertexShaderSource = xhr.responseText;
      var vertexShader = createShader(webGL, vertexShaderSource, webGL.VERTEX_SHADER);
      getFrag();
    }
  }
  xhr.send();
  function getFrag() {
    xhr = new XMLHttpRequest();
    xhr.open("GET", "fragment.glsl", false);
    xhr.onreadystatechange = function() {
      if (this.readystate === 4 && this.status === 200) {
        var fragmentShaderSource = xhr.responseText;
        var fragmentShader = createShader(webGL, fragmentShaderSource, webGL.FRAGMENT_SHADER);
        draw();
      }
    }
  }
  function draw() {
    program = webGL.createProgram();
    webGL.attachShader(program, vertexShader);
    webGL.attachShader(program, fragmentShader);
    webGL.linkProgram(program);
  
      // Coordonates for the square
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

function main() {
  // Start webGL on the canvas
  const canvas = document.getElementById("webgl-canvas");
  const webGL = canvas.getContext("webgl");

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
  fullscreenButton = document.getElementById("fullscreen-button");
  fullscreenButton.addEventListener("click", fullscreenCanvas);

  // Draw a square
  drawSquare();
}

// Start when the page has loaded
window.onload = main;
