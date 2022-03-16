import Stats from "../node_modules/stats.js/src/Stats.js";
//场景
var scene = new THREE.Scene();

//立方体
var geometry = new THREE.SphereGeometry(100, 40, 40);
var material = new THREE.MeshPhongMaterial({
  color: 0x00ffff,

  side: THREE.DoubleSide,
  specular: 0x444444,
  shininess: 30,
});

var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//辅助坐标系
var axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);

var axesHelper2 = new THREE.AxesHelper(250);
scene.add(axesHelper2);

//光源
var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// var pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(0, 200, 0);
// scene.add(pointLight);

// var pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);

// var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 200, 50);
// directionalLight.target = sphere;
// scene.add(directionalLight);

// var directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   15
// );
// scene.add(directionalLightHelper);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 400, 0);
spotLight.angle = Math.PI / 6;
spotLight.distance = 1000;
spotLight.target = sphere;
scene.add(spotLight);

var spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

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
  // cube.rotateY(0.001 * t);
  var axis = new THREE.Vector3(0, 1, 0);
  sphere.rotateOnAxis(axis, 0.01);

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
