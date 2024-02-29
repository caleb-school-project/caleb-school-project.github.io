var upPressed = false;
var leftPressed = false;
var downPressed = false;
var rightPressed = false;

var floorPromise = fetch("shapes/floor.json").then(function(response) {
  return response.json()
}).then(function(response) {
  physicsObj = new PhysicsObject(response);
  physicsObj.lockPos = true;
  return objects.push(physicsObj) - 1;
});

var squarePromise = fetch("shapes/square.json").then(function(response) {
  return response.json()
}).then(function(response) {
  physicsObj = new PhysicsObject(response);
  physicsObj.addForce([0, -0.001]);
  return objects.push(physicsObj) - 1;
}).then(function(objectIndex) {
  window.onkeydown = function(e) {
    if (e.key == "w" || e.key == "ArrowUp") {
      upPressed = true;
    } else if (e.key == "a" || e.key == "ArrowLeft") {
      leftPressed = true;
    } else if (e.key == "s" || e.key == "ArrowDown") {
      downPressed = true;
    } else if (e.key == "d" || e.key == "ArrowRight") {
      rightPressed = true;
    }
  };
  window.onkeyup = function(e) {
    if (e.key == "w" || e.key == "ArrowUp") {
      upPressed = false;
    } else if (e.key == "a" || e.key == "ArrowLeft") {
      leftPressed = false;
    } else if (e.key == "s" || e.key == "ArrowDown") {
      downPressed = false;
    } else if (e.key == "d" || e.key == "ArrowRight") {
      rightPressed = false;
    }
  };
  objects[objectIndex].update = function() {
    if (upPressed) {
      this.velocity[1] += 0.01;
    }
    if (downPressed) {
      this.velocity[1] -= 0.01;
    }
  };
  for (var objnum = 0; objnum < objects.length; objnum++) {
    objects[objnum].update = function() {
      if (rightPressed) {
        this.velocity[0] += 0.01;
      }
      if (leftPressed) {
        this.velocity[0] -= 0.01;
      }
    }
  }
});
