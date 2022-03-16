import Stats from "./node_modules/stats.js/src/Stats.js";

//场景
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 1, 10000);

//相机
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(0, 0, 500);
camera.lookAt(0, 0, 0);

//渲染器
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize, false);

//光照
var spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(0, 500, 100);
scene.add(spotLight);
spotLight.lookAt(scene);

var pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
pointLight.position.set(0, 200, 200);
scene.add(pointLight);

//地面
var plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2000, 2000, 9, 24),
  new THREE.MeshLambertMaterial({
    color: "#3c5887",
    fog: false,
  })
);

//从PlaneBufferGeometry中提取出坐标数组，修改z坐标
var vertices = plane.geometry.attributes.position.array;
for (let i = 0, l = Math.floor(vertices.length / 3); i < l; i++) {
  var y = Math.floor(i / 10);
  var x = i - y * 10;
  var d = 240;
  if (x == 4 || x == 5) {
    d = 120;
    vertices[3 * i + 2] = Math.random() * d * 2 - d;
  } else {
    d = 240;
    vertices[3 * i + 2] = Math.random() * d * 2 - d;
  }
  if (y == 0 || y == 24) {
    vertices[3 * i + 2] = -60;
  }
}

plane.rotation.x = -Math.PI / 3;
plane.position.y = -200;
scene.add(plane);

//stat.js显示运行状态
var stats = new Stats();
stats.showPanel(0);
stats.dom.style.position = "absolute";
stats.dom.style.left = "0px";
stats.dom.style.top = "0px";
document.getElementById("container").appendChild(stats.dom);

//立方体
var geometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//画线
// var geometry = new THREE.BufferGeometry();
// var vertices = new Float32Array([-10, 0, 0, 0, 10, 0, 10, 0, 0]);
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
// var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

// var line = new THREE.Line(geometry, material);

// scene.add(line);

function animate() {
  stats.begin();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);

  stats.end();

  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();
