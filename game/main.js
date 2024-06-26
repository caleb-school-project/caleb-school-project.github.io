var upPressed = false;
var leftPressed = false;
var downPressed = false;
var rightPressed = false;
var ballIndex;
var score = [0, 0];

function updateScore() {
  var overlay = document.getElementById("overlay");
  overlay.textContent = "Your score: " + score[1] + ". AI score: " + score[0] + ".";
}

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
  physObj.velocity = [-0.5,-0.5];
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
      score[0]++;
      updateScore();
    }
  }
});

loadShape("shapes/pointzone2.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.lockY = true;
  physObj.oncollision = function(collisionObjIndex) {
    if (collisionObjIndex == ballIndex) {
      score[1]++;
      updateScore();
    }
  }
});

loadShape("shapes/paddle.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.update = function() {
    if (upPressed) {
      this.velocity[1] += 0.01;
    }
    if (downPressed) {
      this.velocity[1] -= 0.01;
    }
  }
});

loadShape("shapes/opponentpaddle.json").then(function(physObj) {
  physObj.lockX = true;
  physObj.update = function() {
    if (this.shape.colliders[0].y + this.shape.colliders[0].height / 2 < objects[ballIndex].shape.colliders[0].y + objects[ballIndex].shape.colliders[0].height / 2) {
      this.velocity[1] += 0.01;
    } else if (this.shape.colliders[0].y + this.shape.colliders[0].height / 2 > objects[ballIndex].shape.colliders[0].y + objects[ballIndex].shape.colliders[0].height / 2) {
      this.velocity[1] -= 0.01;
    }
  }
});
