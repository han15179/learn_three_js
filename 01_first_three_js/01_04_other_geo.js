//场景
var scene = new THREE.Scene();

//立方体
var geometry = new THREE.BoxGeometry(100, 100, 100);
var material = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
});
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//球体
var geometry2 = new THREE.SphereGeometry(60, 40, 40);
var material2 = new THREE.MeshLambertMaterial({
  color: 0xff00ff,
});
var mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.translateY(120);
scene.add(mesh2);

//圆柱体
var geometry3 = new THREE.CylinderGeometry(60, 40, 100);
var material3 = new THREE.MeshLambertMaterial({
  color: 0xffff00,
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

//动画
let t0 = new Date();
function animate() {
  requestAnimationFrame(animate);
  let t1 = new Date();
  let t = t1 - t0;
  t0 = t1;
  mesh.rotateY(0.001 * t);
  renderer.render(scene, camera);
}

animate();

//鼠标控制器
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", animate);
