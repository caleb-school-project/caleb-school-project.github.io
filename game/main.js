var upPressed = false;
var leftPressed = false;
var downPressed = false;
var rightPressed = false;
var ballIndex;

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

loadShape("shapes/square.json").then(function(physObj) {
  ballIndex = physObj.index;
  physObj.forces = addVectors(physObj.forces, [-0.05,-0.05]);
});

loadShape("shapes/yboundaries.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.lockY = true;
});

loadShape("shapes/pointzone1.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.lockY = true;
  physObj.oncollision = function(collisionObjIndex) {
    if (collisionObjIndex == ballIndex) {
      console.log("Point zone 1 detected a point!");
    }
  }
});

loadShape("shapes/pointzone2.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.lockY = true;
  physObj.oncollision = function(collisionObjIndex) {
    if (collisionObjIndex == ballIndex) {
      console.log("Point zone 2 detected a point!");
    }
  }
});

loadShape("shapes/paddle.json").then(function(physObj) {
  physObj.update = function() {
    physObj.update = function() {
      if (upPressed) {
        this.velocity[1] += 0.01;
      }
      if (downPressed) {
        this.velocity[1] -= 0.01;
      }
    }
  }
});