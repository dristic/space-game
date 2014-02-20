function Ship() {
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

  this.velocity = new THREE.Vector3();

  this.object = line;
};

// W, A, S, D
// 87, 65, 83, 68
var left = false, right = false;
document.addEventListener('keydown', function (event) {
  if (event.keyCode == 65) left = true;
  if (event.keyCode == 68) right = true;
});

document.addEventListener('keyup', function (event) {
  if (event.keyCode == 65) left = false;
  if (event.keyCode == 68) right = false;
});

Ship.prototype.update = function() {
  if (left) {
    this.velocity.x += -0.2;
  }

  if (right) {
    this.velocity.x += 0.2;
  }

  this.velocity.x *= 0.95;
  if (this.velocity.x < 0.01 && this.velocity.x > -0.01) this.velocity.x = 0;

  this.object.position.add(this.velocity);
};