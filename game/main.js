var upPressed = false;
var leftPressed = false;
var downPressed = false;
var rightPressed = false;

var floorPromise = fetch("shapes/floor.json").then(function(response) {
  return response.json()
}).then(function(response) {
  physicsObj = new PhysicsObject(response);
  physicsObj.lockY = true;
  objIndex = objects.push(physicsObj) - 1;
  objects[objIndex].index = objIndex;
  return objIndex;
}).then(function(objectIndex) {
  objects[objectIndex].oncollision = function(i) {
    if (i == 1) {
      console.log("Square touched floor");
    }
  };
});

var squarePromise = fetch("shapes/square.json").then(function(response) {
  return response.json()
}).then(function(response) {
  physicsObj = new PhysicsObject(response);
  physicsObj.addForce([0, -0.001]);
  objIndex =  objects.push(physicsObj) - 1;
  objects[objIndex].index = objIndex;
  return objIndex;
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
    if (objectIndex == objnum) {
      continue;
    }
    objects[objnum].update = function() {
      if (rightPressed) {
        this.velocity[0] -= 0.01;
      }
      if (leftPressed) {
        this.velocity[0] += 0.01;
      }
    }
  }
});

