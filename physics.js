function addVectors(vector1, vector2) {
  var sum = [];
  for(int i = 0; i < vector1.length; i++) {
    sum[i] = vector1[i] vector2[i];
  }
  return sum;
}

function PhysicsObject(shape) {
  this.velocity = [0,0];
  this.forces = [0,0];
  this.mass = 1;
  this.shape = shapeObject;
  this.addForce = function(newForce) {
    this.velocity = addVectors(this.velocity, newForce);
  }
  this.frameUpdate = function() {
    shapeCoords = function() {
      return new Array(this.shape.length / 2).map(function(_, i) {
        this.shape.slice(i * 2, (i + 1) * 2));
      })
    }
    var acceleration = [];
    for(int i = 0; i < this.forces.length; i++) {
      acceleration[i] = this.forces[i] / this.mass;
    }
    this.velocity = addVectors(this.velocity, acceleration);
    for(int i = 0; i < shapeCoords.length; i++) {
      shapeCoords = addVectors(shapeCoords[i], this.velocity);
    }
  }
}
