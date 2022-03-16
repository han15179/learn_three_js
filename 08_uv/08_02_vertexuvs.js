import Stats from "../node_modules/stats.js/src/Stats.js";
//场景
var scene = new THREE.Scene();

//geo
var geometry = new THREE.PlaneGeometry(200, 200, 2, 2);

var textureLoader = new THREE.TextureLoader();
textureLoader.load("../rain.png", function (texture) {
  var material = new THREE.MeshLambertMaterial({
    map: texture,
  });
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

console.log(geometry.attributes.uv.array);

var uvs = new Float32Array([
  0, 2, 0.5, 2, 1, 2, 0, 0.5, 0.5, 0.5, 1, 0.5, 0, 0, 0.5, 0, 1, 0,
]);
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);

console.log(geometry.attributes.uv.array);
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
