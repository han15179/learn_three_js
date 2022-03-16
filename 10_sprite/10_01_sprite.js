import Stats from "../node_modules/stats.js/src/Stats.js";
//场景
var scene = new THREE.Scene();

//geo

var texture = new THREE.TextureLoader().load("../snow.png");

var group = new THREE.Group();

for (let i = 0; i < 12000; i++) {
  var spriteMaterial = new THREE.SpriteMaterial({
    // color: 0xff00ff,
    // rotation: Math.PI / 4,
    map: texture,
  });
  var sprite = new THREE.Sprite(spriteMaterial);
  // scene.add(sprite);
  sprite.scale.set(8, 10, 1);
  var k1 = Math.random() - 0.5;
  var k2 = Math.random();
  var k3 = Math.random() - 0.5;
  sprite.position.set(3000 * k1, 1000 * k2, 3000 * k3);
  
  group.add(sprite);
}

scene.add(group);

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

//光照
var spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(0, 500, 100);
scene.add(spotLight);
spotLight.lookAt(scene);

var pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
pointLight.position.set(0, 200, 200);
scene.add(pointLight);

//摄像机
var width = window.innerWidth;
var height = window.innerHeight;
var k = width / height;
var s = 200;
var camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
camera.position.set(0, 100, 500);
camera.lookAt(scene.position);

//渲染器
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
// renderer.setClearColor(0xb9d3ff, 1);
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

  group.children.forEach((sprite) => {
    sprite.position.y -= 5;
    if (sprite.position.y < -200) {
      sprite.position.y = 1000;
    }
  });

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
