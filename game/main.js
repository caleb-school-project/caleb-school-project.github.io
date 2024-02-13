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
  physicsObj.addForce([0, -0.0001]);
  return objects.push(physicsObj) - 1;
}).then(function(objectIndex) {
  window.onkeydown = function(e) {
    if (e.key == "w" || e.key == "ArrowUp") {
      objects[objectIndex].addForce([0, 0.0001]);
    } else if (e.key == "a" || e.key == "ArrowLeft") {
      objects[objectIndex].addForce([-0.0001, 0]);
    } else if (e.key == "s" || e.key == "ArrowDown") {
      objects[objectIndex].addForce([0, -0.0001]);
    } else if (e.key == "d" || e.key == "ArrowRight") {
      objects[objectIndex].addForce([0.0001, 0]);
    }
  };
  window.onkeyup = function(e) {
    if (e.key == "w" || e.key == "ArrowUp") {
      objects[objectIndex].addForce([0, -0.0001]);
    } else if (e.key == "a" || e.key == "ArrowLeft") {
      objects[objectIndex].addForce([0.0001, 0]);
    } else if (e.key == "s" || e.key == "ArrowDown") {
      objects[objectIndex].addForce([0, 0.0001]);
    } else if (e.key == "d" || e.key == "ArrowRight") {
      objects[objectIndex].addForce([-0.0001, 0]);
    }
  };
});
