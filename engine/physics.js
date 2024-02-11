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
    var move = (velocity) => {
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
    }
    var acceleration = [];
    for(var i = 0; i < this.forces.length; i++) {
      acceleration[i] = this.forces[i] / this.mass;
    }
    this.velocity = addVectors(this.velocity, acceleration);
    move(this.velocity);
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].shape.colliders == this.shape.colliders) {
        continue;
      }
      for (var collidernum = 0; collidernum < objects[i].shape.colliders.length; collidernum++) {
        if (this.shape.colliders[0][0] + this.shape.colliders[0][2] > objects[i].shape.colliders[collidernum][0] && this.shape.colliders[0][0] < objects[i].shape.colliders[collidernum][0] + objects[i].shape.colliders[collidernum][2] && this.shape.colliders[0][1] + this.shape.colliders[0][3] > objects[i].shape.colliders[collidernum][1] && this.shape.colliders[0][1] < objects[i].shape.colliders[collidernum][1] + objects[i].shape.colliders[collidernum][3]) {
          objects[i].velocity = [this.velocity[0] - objects[i].velocity[0], this.velocity[1] - objects[i].velocity[1]];
          this.velocity = [objects[i].velocity[0] - this.velocity[0], objects[i].velocity[1] - this.velocity[1]];
          console.log(this.velocity);
        }
      }
    }
  }
}
