var upPressed = false;
var leftPressed = false;
var downPressed = false;
var rightPressed = false;

loadShape("shapes/floor.json").then(function(physObj) {
  physObj.lockY = true;
  physObj.oncollision = function(i) {
    if (i == 1) {
      console.log("Square touched floor");
    }
  };
});

loadShape("shapes/square.json").then(function(physObj) {
  physObj.forces = addVectors(physObj.forces, [0,-0.05]);
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
  physObj.update = function() {
    if (upPressed) {
      this.velocity[1] += 0.01;
    }
    if (downPressed) {
      this.velocity[1] -= 0.01;
    }
  };
  for (var objnum = 0; objnum < objects.length; objnum++) {
    if (objnum == physObj.index) {
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

loadShape("shapes/yboundaries.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.lockY = true;
});
