var floorPromise = fetch("shapes/floor.json").then(function(response) {
  return response.json()
}).then(function(response) {
  physicsObj = new PhysicsObject(response);
  physicsObj.lockPos = true;
  objects.push(physicsObj) - 1;
});

var squarePromise = fetch("shapes/square.json").then(function(response) {
  return response.json()
}).then(function(response) {
  physicsObj = new PhysicsObject(response);
  physicsObj.addForce([0, -0.0001]);
  objects.push(physicsObj) - 1;
});
