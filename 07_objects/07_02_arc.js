import Stats from "../node_modules/stats.js/src/Stats.js";
//场景
var scene = new THREE.Scene();

//geo
var geometry = new THREE.BufferGeometry();
var arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI);
var points = arc.getPoints(50);
geometry.setFromPoints(points);

var material = new THREE.LineBasicMaterial({
  color: 0x000000,
});

var line = new THREE.Line(geometry, material);
scene.add(line);

var geometry2 = new THREE.BufferGeometry();
var p1 = new THREE.Vector3(50, 0, 0);
var p2 = new THREE.Vector3(0, 70, 0);

geometry2.setFromPoints([p1, p2]);

var line2 = new THREE.Line(geometry2, material);
scene.add(line2);

var geometry3 = new THREE.BufferGeometry();
var p1 = new THREE.Vector3(60, 0, 0);
var p2 = new THREE.Vector3(0, 80, 0);
var lineCurve = new THREE.LineCurve3(p1, p2);
geometry3.setFromPoints(lineCurve.getPoints(10));

var line3 = new THREE.Line(geometry3, material);
scene.add(line3);

//辅助坐标系
var axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);

//光源
var pointLight = new THREE.PointLight(0x444444);
pointLight.position.set(400, 200, 300);
scene.add(pointLight);

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
