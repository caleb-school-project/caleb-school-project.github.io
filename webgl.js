// Main webGL function

function getFile(file) {
  xhr = new XMLHttpRequest();
  xhr.open("GET", file, false);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      return xhr.responseText;
    }
  }
  xhr.send();
}

function createShader(webgl, source, type) {
  const shader = webgl.createShader(type);
  webgl.shaderSource(shader, source);
  webgl.compileShader(shader);
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

  // Get the shaders
  vertexShaderSource = getFile("vertex.glsl");
  createShader(webGL, vertexShaderSource, webGL.VERTEX_SHADER);
  fragmentShaderSource = getFile("fragment.glsl");
  createShader(webGL, fragmentShaderSource, webGL.FRAGMENT_SHADER);

  // Coordonates for a square
  squareVerticies = new Float32Array([
    -0.5, 0.5, -0.5, -0.5, 0.5, -0.5
    -0.5, 0.5, 0.5, 0.5, 0.5, -0.5
  ]);
}

// Start when the page has loaded
window.onload = main;
