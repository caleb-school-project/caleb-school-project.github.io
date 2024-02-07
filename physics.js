function PhysicsObject(shape) {
  this.velocity = [0,0];
  this.forces = [0,0];
  this.gravity = false;
  this.mass = 1;
  this.shape = shapeObject;
  this.addForce = function(newForce) {
    for(int i = 0; i < 4; i++) {
      this.forces[i] = newForce[i];
    }
  }
  this.frameUpdate = function() {
    if (this.gravity == true) {
      this.forces += [0,-mass];
    }
    for(int i = 0; i < shapeObject.triangles.flat().length; i++) {
      
    }
  }
}
