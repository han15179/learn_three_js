import Stats from "../node_modules/stats.js/src/Stats.js";

//场景
var scene = new THREE.Scene();

//
var geometry = new THREE.BufferGeometry();

var vertices = new Float32Array([
  0, 0, 0, 50, 0, 0, 0, 100, 0, 0, 0, 10, 0, 0, 100, 50, 0, 10,
]);

var attribue = new THREE.BufferAttribute(vertices, 3);

geometry.attributes.position = attribue;

var normals = new Float32Array([
  0, 0, 1, 0, 0, 1, 0, 0, 1,

  0, 1, 0, 0, 1, 0, 0, 1, 0,
]);

geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

// var material = new THREE.MeshBasicMaterial({
//   color: 0x0000ff,
//   side: THREE.DoubleSide,
// });

// var mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// var material = new THREE.PointsMaterial({
//   color: 0xff0000,
//   size: 10.0,
// });
// var points = new THREE.Points(geometry, material);
// scene.add(points);

var material = new THREE.LineBasicMaterial({
  color: 0xff0000,
});
var line = new THREE.Line(geometry, material);
scene.add(line);

//辅助坐标系
var axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);

//光源
var point = new THREE.PointLight(0x444444);
point.position.set(400, 200, 300);
scene.add(point);

var ambient = new THREE.AmbientLight(0x444444);
scene.add(ambient);

//摄像机
var width = window.innerWidth;
var height = window.innerHeight;
var k = width / height;
var s = 200;
var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
camera.position.set(200, 300, 200);
camera.lookAt(scene.position);

//渲染器
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xb9d3ff, 1);
document.body.appendChild(renderer.domElement);

//stat.js显示运行状态
var stats = new Stats();
stats.showPanel(0);
stats.dom.style.position = "absolute";
stats.dom.style.left = "0px";
stats.dom.style.top = "0px";
document.getElementById("container").appendChild(stats.dom);

//动画
function animate() {
  stats.begin();
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
