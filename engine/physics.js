function addVectors(vector1, vector2) {
  var sum = [];
  for(var i = 0; i < vector1.length; i++) {
    sum[i] = vector1[i] + vector2[i];
  }
  return sum;
}

function PhysicsObject(shapeObj) {
  const update = new Event("update");
  this.velocity = [0,0];
  this.forces = [0,0];
  this.mass = 1;
  this.lockPos = false;
  this.shape = shapeObj;
  this.move = function(velocity) {
    if (!this.lockPos) {
      shapeCoords = new Array(this.shape.triangles.flat().length / 2).fill().map((_, i) => {
        return this.shape.triangles.flat().slice(i * 2, (i + 1) * 2);
      });
      for(var i = 0; i < shapeCoords.length; i++) {
        shapeCoords[i] = addVectors(shapeCoords[i], velocity);
      }
      this.shape.triangles = shapeCoords;
      for (i = 0; i < this.shape.colliders.length; i++) {
        this.shape.colliders[i][0] += velocity[0];
        this.shape.colliders[i][1] += velocity[1];
      }
      this.dispatchEvent(update);
    }
  }
  this.addForce = function(newForce) {
    this.forces = addVectors(this.forces, newForce);
  }
  this.frameUpdate = function() {
    var acceleration = [];
    for(var i = 0; i < this.forces.length; i++) {
      acceleration[i] = this.forces[i] / this.mass;
    }
    this.velocity = addVectors(this.velocity, acceleration);
    this.move(this.velocity);
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].shape.colliders == this.shape.colliders) {
        continue;
      }
      for (var collidernum = 0; collidernum < objects[i].shape.colliders.length; collidernum++) {
        if (this.shape.colliders[0][0] + this.shape.colliders[0][2] > objects[i].shape.colliders[collidernum][0] && this.shape.colliders[0][0] < objects[i].shape.colliders[collidernum][0] + objects[i].shape.colliders[collidernum][2] && this.shape.colliders[0][1] + this.shape.colliders[0][3] > objects[i].shape.colliders[collidernum][1] && this.shape.colliders[0][1] < objects[i].shape.colliders[collidernum][1] + objects[i].shape.colliders[collidernum][3]) {
          thisMomentum = [this.velocity[0] * this.mass, this.velocity[1] * this.mass];
          otherMomentum = [objects[i].velocity[0] * objects[i].mass, objects[i].velocity[1] * objects[i].mass];
          if (this.lockPos) {
            var otherVelocity = [-objects[i].velocity[0], -objects[i].velocity[1]];
            var thisVelocity = [0, 0];
          } else if (objects[i].lockPos) {
            var otherVelocity = [0, 0];
            var thisVelocity = [-this.velocity[0], -this.velocity[1]];
          } else {
            var otherNewMomentum = addVectors(otherMomentum, [thisMomentum[0] - otherMomentum[0], thisMomentum[1] - otherMomentum[1]]);
            var thisNewMomentum = addVectors(thisMomentum, [otherMomentum[0] - thisMomentum[0], otherMomentum[1] - thisMomentum[1]]);
            var otherVelocity = [otherNewMomentum[0] / objects[i].mass, otherNewMomentum[1] / objects[i].mass];
            var thisVelocity = [thisNewMomentum[0] / this.mass, thisNewMomentum[1] / this.mass];
          }
          objects[i].velocity = otherVelocity;
          this.velocity = thisVelocity;
          objects[i].move(objects[i].velocity);
          this.move(this.velocity);
        }
      }
    }
  }
}
