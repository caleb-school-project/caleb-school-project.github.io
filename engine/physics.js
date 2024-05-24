function addVectors(vector1, vector2) {
  var sum = [];
  for(var i = 0; i < vector1.length; i++) {
    sum[i] = vector1[i] + vector2[i];
  }
  return sum;
}

function PhysicsObject(shapeObj) {
  this.lastFrameTime = new Date().getTime();
  this.deltaTime = 0;
  this.index = 0;
  this.update = new Function();
  this.oncollision = function(collisionObjIndex) {};
  this.velocity = [0,0];
  this.forces = [0,0];
  this.mass = 1;
  this.lockX = false;
  this.lockY = false;
  this.shape = shapeObj;
  this.lastshape = shapeObj;
  this.move = function(velocity) {
    this.lastshape = this.shape;
    if (this.lockX) { this.velocity[0] = 0; }
    if (this.lockY) { this.velocity[1] = 0; }
    shapeCoords = new Array(this.shape.triangles.flat().length / 2).fill().map((_, i) => {
      return this.shape.triangles.flat().slice(i * 2, (i + 1) * 2);
    });
    for(var i = 0; i < shapeCoords.length; i++) {
      shapeCoords[i] = addVectors(shapeCoords[i], [velocity[0] * this.deltaTime, velocity[1] * this.deltaTime]);
    }
    this.shape.triangles = shapeCoords;
    for (i = 0; i < this.shape.colliders.length; i++) {
      this.shape.colliders[i].x += velocity[0] * this.deltaTime;
      this.shape.colliders[i].y += velocity[1] * this.deltaTime;
    }
  }
  this.addForce = function(newForce) {
    this.forces = addVectors(this.forces, newForce);
  }
  this.frameUpdate = function() {
    var d = new Date();
    var thisFrameTime = d.getTime();
    this.deltaTime = (thisFrameTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = thisFrameTime;
    var acceleration = [];
    for(var i = 0; i < this.forces.length; i++) {
      acceleration[i] = this.forces[i] / this.mass;
    }
    this.velocity = addVectors(this.velocity, acceleration);
    this.update();
    this.move(this.velocity);
    for (var collider = 0; collider < this.shape.colliders.length; collider++) {
      for (var i = 0; i < objects.length; i++) {
        if (objects[i].index == this.index) {
          continue;
        }
        for (var collidernum = 0; collidernum < objects[i].shape.colliders.length; collidernum++) {
          if (this.shape.colliders[collider].x + this.shape.colliders[collider].width > objects[i].shape.colliders[collidernum].x && this.shape.colliders[collider].x < objects[i].shape.colliders[collidernum].x + objects[i].shape.colliders[collidernum].width && this.shape.colliders[collider].y + this.shape.colliders[collider].height > objects[i].shape.colliders[collidernum].y && this.shape.colliders[collider].y < objects[i].shape.colliders[collidernum].y + objects[i].shape.colliders[collidernum].height) {
            this.oncollision(i);
            objects[i].oncollision(this.index);
            thisMomentum = [this.velocity[0] * this.mass, this.velocity[1] * this.mass];
            otherMomentum = [objects[i].velocity[0] * objects[i].mass, objects[i].velocity[1] * objects[i].mass];
            var thisNewMomentum = thisMomentum;
            var otherNewMomentum = otherMomentum;
            if(this.shape.colliders[collider].x + this.shape.colliders[collider].width < Math.abs(objects[i].shape.colliders[collidernum].x)) {
              XCollision();
            }
            if (Math.abs(this.shape.colliders[collider].x) > Math.abs(objects[i].shape.colliders[collidernum].x + objects[i].shape.colliders[collidernum].width)) {
              XCollision();
            }
            if (Math.abs(this.shape.colliders[collider].y + this.shape.colliders[collider].height) < Math.abs(objects[i].shape.colliders[collidernum].y)) {
              YCollision();
            }
            if (Math.abs(this.shape.colliders[collider].y) > Math.abs(objects[i].shape.colliders[collidernum].y + objects[i].shape.colliders[collidernum].height)) {
              YCollision();
            }
            function XCollision() {
              otherNewMomentum[0] = thisMomentum[0] + (otherMomentum[0] - thisMomentum[0]);
              thisNewMomentum[0] = otherMomentum[0] + (thisMomentum[0] - otherMomentum[0]);
            }
            function YCollision() {
              otherNewMomentum[1] = thisMomentum[1] + (otherMomentum[1] - thisMomentum[1]);
              thisNewMomentum[1] = otherMomentum[1] + (thisMomentum[1] - otherMomentum[1]);
            }
            if (this.lockX) {
              otherNewMomentum[0] -= thisNewMomentum[0];
              thisNewMomentum[0] = 0;
            }
            if (this.lockY) {
              otherNewMomentum[1] -= thisNewMomentum[1];
              thisNewMomentum[1] = 0;
            }
            if (objects[i].lockX) {
              thisNewMomentum[0] -= otherNewMomentum[0];
              otherNewMomentum[0] = 0;
            }
            if (objects[i].lockY) {
              thisNewMomentum[1] -= otherNewMomentum[1];
              otherNewMomentum[1] = 0;
            }
            var otherVelocity = [otherNewMomentum[0] / objects[i].mass, otherNewMomentum[1] / objects[i].mass];
            var thisVelocity = [thisNewMomentum[0] / this.mass, thisNewMomentum[1] / this.mass];
            objects[i].velocity = otherVelocity;
            this.velocity = thisVelocity;
            objects[i].move(objects[i].velocity);
            this.move(this.velocity);
          }
        }
      }
    }
  }
}
