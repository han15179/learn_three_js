import Stats from "../node_modules/stats.js/src/Stats.js";

//场景
var scene = new THREE.Scene();

//立方体
var geometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  wireframe: true,
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//球体
var geometry2 = new THREE.SphereGeometry(60, 10, 10);
var material2 = new THREE.MeshLambertMaterial({
  color: 0xff00ff,
});
var mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.translateY(120);
scene.add(mesh2);

//圆柱体
var geometry3 = new THREE.CylinderGeometry(60, 40, 100);
var material3 = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  wireframe: true,
  specular: 0x4488ee,
  shininess: 12,
});
var mesh3 = new THREE.Mesh(geometry3, material3);
mesh3.position.set(120, 0, 0);
scene.add(mesh3);

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
let t0 = new Date();
function animate() {
  stats.begin();
  let t1 = new Date();
  let t = t1 - t0;
  t0 = t1;
  mesh.rotateY(0.001 * t);
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
