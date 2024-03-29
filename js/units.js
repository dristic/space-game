/////////////
/// Enemy
/////////////////
function Enemy(position, velocity) {
  var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 1,
    linewidth: 3
  });

  var size = 8;
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-size, -size, 0));
  geometry.vertices.push(new THREE.Vector3(-size, size, 0));
  geometry.vertices.push(new THREE.Vector3(size, size, 0));
  geometry.vertices.push(new THREE.Vector3(size, -size, 0));
  geometry.vertices.push(new THREE.Vector3(-size, -size, 0));
  this.size = size;

  var line = new THREE.Line(geometry, material);
  line.position.add(position);

  this.velocity = velocity;

  this.object = line;
  this.i = 1;
  this.rotateKey = ["x", "y", "z"][Math.floor(Math.random() * 3)]
}

Enemy.prototype.update = function() {
  if (this.object.position.y < -1000) this.shouldDelete = true;
  this.object.position.add(this.velocity);

  this.i += 0.1;
  this.object.rotation[this.rotateKey] = Math.sin(this.i);
};

Enemy.prototype.aabb = function() {
  return new THREE.Box2(
    new THREE.Vector2(this.object.position.x - this.size, this.object.position.y - this.size),
    new THREE.Vector2(this.object.position.x + this.size, this.object.position.y + this.size)
  );
};

/////////////
// Ship
/////////////
function Ship(position, scene) {
  var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 1,
    linewidth: 3
  });

  // Add geometry
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 15, 0));
  geometry.vertices.push(new THREE.Vector3(10, 0, 0));
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0));

  // Create line from geom
  var line = new THREE.Line(geometry, material);
  line.position.add(position);

  this.velocity = new THREE.Vector3();

  this.object = line;
  this.scene = scene;
  this.bullets = [];
};

// W, A, S, D
// 87, 65, 83, 68
var left, right, shoot;
document.addEventListener('keydown', function (event) {
  if (event.keyCode == 65) left = true;
  if (event.keyCode == 68) right = true;
  if (event.keyCode == 32) shoot = true;
});

document.addEventListener('keyup', function (event) {
  if (event.keyCode == 65) left = false;
  if (event.keyCode == 68) right = false;
});

Ship.prototype.shoot = function() {
  var origin = new THREE.Vector3(this.object.position.x, this.object.position.y + 10, this.object.position.z);
  var bullet = new Bullet(origin, new THREE.Vector3(0, 5, 0));
  this.scene.add(bullet.object);
  this.bullets.push(bullet);
};

Ship.prototype.update = function() {
  if (shoot) {
    this.shoot();
    shoot = false;
  }

  if (left) {
    this.velocity.x += -0.2;
  }

  if (right) {
    this.velocity.x += 0.2;
  }

  this.velocity.x *= 0.95;
  if (this.velocity.x < 0.01 && this.velocity.x > -0.01) this.velocity.x = 0;

  this.object.position.add(this.velocity);
  this.object.position.clamp(new THREE.Vector3(-200, -1000, 0), new THREE.Vector3(200, 1000, 0));

  for (var i = this.bullets.length - 1; i >= 0; i--) {
    this.bullets[i].update();
    if(this.bullets[i].shouldDelete) {
      this.scene.remove(this.bullets[i].object);
      this.bullets.splice(i, 1);
    }
  };
};

/////
// Bullet
//////
function Bullet(origin, direction) {
  var material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 1,
    linewidth: 3
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 5, 0));

  var line = new THREE.Line(geometry, material);
  line.position.add(origin);

  this.velocity = new THREE.Vector3();
  this.velocity.add(direction);

  this.object = line;
};

Bullet.prototype.update = function() {
  if (this.object.position.y > 1000) this.shouldDelete = true;
  this.object.position.add(this.velocity);
};