import Stats from "../node_modules/stats.js/src/Stats.js";

var scene, camera, renderer, points;
var stats;

init();

function init() {
  addScene();
  addLights();
  addStats();
  addPoints();
  animate();
}

function addScene() {
  //场景
  scene = new THREE.Scene();

  //摄像机
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
  camera.position.set(0, 0, 200);
  camera.lookAt(scene.position);

  //渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  //   renderer.setClearColor(0xb9d3ff, 1);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}

function addLights() {
  //光照
  var spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(0, 500, 100);
  scene.add(spotLight);
  spotLight.lookAt(scene);

  var pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
  pointLight.position.set(0, 200, 200);
  scene.add(pointLight);
}

function addPoints() {
  var geometry = new THREE.BufferGeometry();
  var pos = new Float32Array([0, 0, 0]);
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  var material = new THREE.PointsMaterial({
    size: 4,
    sizeAttenuation: true,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    map: new THREE.TextureLoader().load("./gradient.png"),
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
  console.log(points);

  window.addEventListener("click", onClickPoints, false);
}

//加入Stat插件
function addStats() {
  //stat.js显示运行状态
  stats = new Stats();
  stats.showPanel(0);
  stats.dom.style.position = "absolute";
  stats.dom.style.left = "0px";
  stats.dom.style.top = "0px";
  document.getElementById("container").appendChild(stats.dom);
}

//动画
function animate() {
  stats.begin();
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClickPoints() {
  var vertices = points.geometry.attributes.position.array;
  var count = points.geometry.attributes.position.count;
  vertices[0] ++;
  points.geometry.attributes.position.needsUpdate = true;
}
