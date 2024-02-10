function addVectors(vector1, vector2) {
  var sum = [];
  for(var i = 0; i < vector1.length; i++) {
    sum[i] = vector1[i] + vector2[i];
  }
  return sum;
}

function PhysicsObject(shapeObj) {
  this.velocity = [0,0];
  this.forces = [0,0];
  this.mass = 1;
  this.shape = shapeObj;
  this.addForce = function(newForce) {
    this.forces = addVectors(this.forces, newForce);
  }
  this.frameUpdate = function() {
    shapeCoords = new Array(this.shape.triangles.flat().length / 2).fill().map((_, i) => {
      return this.shape.triangles.flat().slice(i * 2, (i + 1) * 2);
    });
    var acceleration = [];
    for(var i = 0; i < this.forces.length; i++) {
      acceleration[i] = this.forces[i] / this.mass;
    }
    this.velocity = addVectors(this.velocity, acceleration);
    for(var i = 0; i < shapeCoords.length; i++) {
      shapeCoords[i] = addVectors(shapeCoords[i], this.velocity);
    }
    this.shape.triangles = shapeCoords;
  }
}
