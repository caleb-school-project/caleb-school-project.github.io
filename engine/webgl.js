// Main webGL function

// Start when the page has loaded
window.onload = main;

var webGL;
var objects = [];
var webGLShaders;
var camerashift = [0,0];

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
  }).then(function(shaders) {
    loadingMessage.textContent = "";
    webGLProgram = shaders;
    frameUpdate();
  });

  function frameUpdate() {
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
      var aspect = canvas.width / canvas.height;
      var aspects = new Array(itemNum * 4).fill(aspect);

      // Make a buffer for the shape vertices
      var shapeBuffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, shapeBuffer);
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(allTriangles), webGL.STATIC_DRAW);
      
      // Make a buffer for the camera shift
      var cameraBuffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, cameraBuffer);
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(camerashift), webGL.STATIC_DRAW);
      
      // Make a buffer for the colors
      var colorBuffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, colorBuffer);
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(allColors), webGL.STATIC_DRAW);

      // Make a buffer for the aspect
      var aspectBuffer = webGL.createBuffer();
      webGL.bindBuffer(webGL.ARRAY_BUFFER, aspectBuffer);
      webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(aspects), webGL.STATIC_DRAW);

      // Get the program ready
      webGL.useProgram(webGLProgram);

      webGLProgram.position = webGL.getAttribLocation(webGLProgram, "position");
      webGL.bindBuffer(webGL.ARRAY_BUFFER, shapeBuffer);
      webGL.enableVertexAttribArray(webGLProgram.position);
      webGL.vertexAttribPointer(webGLProgram.position, dimensions, webGL.FLOAT, false, 0, 0);

      webGLProgram.camera = webGL.getAttribLocation(webGLProgram, "camerashift")
      webGL.bindBuffer(webGL.ARRAY_BUFFER, colorBuffer);
      webGL.enableVertexAttribArray(webGLProgram.camera);
      webGL.vertexAttribPointer(webGLProgram.camera, dimensions, webGL.FLOAT, false, 0, 0);

      webGLProgram.color = webGL.getAttribLocation(webGLProgram, "color");
      webGL.bindBuffer(webGL.ARRAY_BUFFER, colorBuffer);
      webGL.enableVertexAttribArray(webGLProgram.color);
      webGL.vertexAttribPointer(webGLProgram.color, 4, webGL.FLOAT, false, 0, 0);

      webGLProgram.aspect = webGL.getAttribLocation(webGLProgram, "aspect");
      webGL.bindBuffer(webGL.ARRAY_BUFFER, aspectBuffer);
      webGL.enableVertexAttribArray(webGLProgram.aspect);
      webGL.vertexAttribPointer(webGLProgram.aspect, 4, webGL.FLOAT, false, 0, 0);

      // Draw it!
      webGL.drawArrays(webGL.TRIANGLES, 0, itemNum);
      window.requestAnimationFrame(frameUpdate);
    }
  }
}
