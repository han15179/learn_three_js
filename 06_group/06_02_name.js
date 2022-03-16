import Stats from "../node_modules/stats.js/src/Stats.js";
//场景
var scene = new THREE.Scene();

// 头部网格模型和组
var headMesh = sphereMesh(10, 0, 0, 0);
headMesh.name = "脑壳";
var leftEyeMesh = sphereMesh(1, 8, 5, 4);
leftEyeMesh.name = "左眼";
var rightEyeMesh = sphereMesh(1, 8, 5, -4);
rightEyeMesh.name = "右眼";
var headGroup = new THREE.Group();
headGroup.name = "头部";
headGroup.add(headMesh, leftEyeMesh, rightEyeMesh);
// 身体网格模型和组
var neckMesh = cylinderMesh(3, 10, 0, -15, 0);
neckMesh.name = "脖子";
var bodyMesh = cylinderMesh(14, 30, 0, -35, 0);
bodyMesh.name = "腹部";
var leftHandMesh = cylinderMesh(3, 40, 0, -40, -17);
leftHandMesh.name = "左臂";
var rightHandMesh = cylinderMesh(3, 40, 0, -40, 17);
rightHandMesh.name = "右臂";
var leftLegMesh = cylinderMesh(4, 60, 0, -80, -7);
leftLegMesh.name = "左腿";
var rightLegMesh = cylinderMesh(4, 60, 0, -80, 7);
rightLegMesh.name = "右腿";
var legGroup = new THREE.Group();
legGroup.name = "腿";
legGroup.add(leftLegMesh, rightLegMesh);
var bodyGroup = new THREE.Group();
bodyGroup.name = "身体";
bodyGroup.add(neckMesh, bodyMesh, legGroup, leftHandMesh, rightHandMesh);
// 人Group
var personGroup = new THREE.Group();
personGroup.name = "人";
personGroup.add(headGroup, bodyGroup);
personGroup.translateY(50);
scene.add(personGroup);

// 球体网格模型创建函数
function sphereMesh(R, x, y, z) {
  var geometry = new THREE.SphereGeometry(R, 25, 25); //球体几何体
  var material = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
  }); //材质对象Material
  var mesh = new THREE.Mesh(geometry, material); // 创建网格模型对象
  mesh.position.set(x, y, z);
  return mesh;
}
// 圆柱体网格模型创建函数
function cylinderMesh(R, h, x, y, z) {
  var geometry = new THREE.CylinderGeometry(R, R, h, 25, 25); //球体几何体
  var material = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
  }); //材质对象Material
  var mesh = new THREE.Mesh(geometry, material); // 创建网格模型对象
  mesh.position.set(x, y, z);
  return mesh;
}

scene.traverse(function (obj) {
  if (obj.type === "Group") {
    console.log(obj.name);
  }
  if (obj.type === "Mesh") {
    console.log("  " + obj.name);
    obj.material.color.set(0xffff00);
  }
  if ((obj.name === "左眼") | (obj.name === "右眼")) {
    obj.material.color.set(0x000000);
  }
  // 打印id属性
  console.log(obj.id);
  // 打印该对象的父对象
  console.log(obj.parent);
  // 打印该对象的子对象
  console.log(obj.children);
});

scene.getObjectByName("左腿").material.color.set(0xff0000);


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

  personGroup.rotateY(0.01);

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
