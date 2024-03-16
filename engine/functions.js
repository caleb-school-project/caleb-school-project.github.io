// Take a filename and return a physics object
function loadShape(filename) {
  var shapePromise = fetch(filename).then(function(response) {
    return response.json()
  }).then(function(response) {
    var physicsObj = new PhysicsObject(response);
    var objIndex = objects.push(physicsObj) - 1;
    objects[objIndex].index = objIndex;
    return objects[objIndex];
  });
  return shapePromise;
}
