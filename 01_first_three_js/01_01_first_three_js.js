var scene = new THREE.Scene();

// var geometry = new THREE.BoxGeometry(100, 100, 100);
var geometry = new THREE.SphereGeometry(60, 40, 40);
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var point = new THREE.PointLight(0x444444);
point.position.set(400, 200, 300);
scene.add(point);

var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);

var width = window.innerWidth;
var height = window.innerHeight;
var k = width / height;
var s = 200;
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(200, 300, 200);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xb9d3ff, 1);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
