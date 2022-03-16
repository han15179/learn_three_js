import Stats from "../node_modules/stats.js/src/Stats.js";

var scene, camera, renderer;
var stats;

init();

function init() {
  addScene();
  addLight();
  addStats();
  addLines();
  animate();
}

function addScene() {
  //Scene
  scene = new THREE.Scene();

  //Camera
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
  camera.position.set(0, 0, 100);
  camera.lookAt(scene.position);

  //render
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  //
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}

function addLight() {
  //light
  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(25, 30, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function addLines() {
  const circleLine = new FlowingCircleLine(
    new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, -30, 0),
        new THREE.Vector3(-30, 0, 0),
        new THREE.Vector3(0, 30, 0),
        new THREE.Vector3(30, 0, 0),
      ],
      true
    )
  );
  scene.add(circleLine);

  const circleLine2 = new FlowingCircleLine(
    new THREE.EllipseCurve(0, 0, 30, 30, 0, Math.PI * 2, true, -Math.PI / 2)
  );
  scene.add(circleLine2);

  for (let i = 0; i < 10; i++) {
    const t = new FlowingCircleLine(
      new THREE.EllipseCurve(0, 0, 20, 20, 0, Math.PI * 2, true),
      20,
      {
        r: 0.1 * i,
        g: 0.5,
        b: 0.5,
      },
      3
    );
    t.rotation.z = (Math.PI * 2 * i) / 10;
    scene.add(t);
  }
}

function FlowingCircleLine(linePath, lineLength, lineColor, moveSpeed) {
  var circleLine = new FlowingLine(
    linePath,
    lineLength,
    lineColor,
    moveSpeed,
    true
  );
  return circleLine;
}

function FlowingLine(linePath, lineLength, lineColor, moveSpeed, isCircleLine) {
  this.line = null;
  this.linePath = linePath
    ? linePath
    : new THREE.CatmullRomCurve3([
        new THREE.Vector3(-100, 0, 0),
        new THREE.Vector3(100, 0, 0),
      ]);

  this.lineColor = lineColor
    ? lineColor
    : {
        r: 0.2,
        g: 0.5,
        b: 0.8,
      };

  this.pathPointNums = 200;
  this.lineLength = lineLength ? lineLength : 20;
  this.lineStartIndex = 0;
  this.moveSpeed = moveSpeed ? moveSpeed : 4;
  this.initLine = (() => {
    this.pathPoints = this.linePath.getPoints(this.pathPointNums);
    this.pathPoints.push(...this.pathPoints);

    var positions = new Float32Array(this.lineLength * 3);
    var colors = new Float32Array(this.lineLength * 3);

    for (
      let i = this.lineStartIndex, j = 0;
      i < this.lineStartIndex + this.lineLength;
      i++, j++
    ) {
      positions[3 * j] = this.pathPoints[i].x;
      positions[3 * j + 1] = this.pathPoints[i].y;
      positions[3 * j + 2] = this.pathPoints[i].z ? this.pathPoints[i].z : 0;

      colors[3 * j] = (this.lineColor.r * j) / this.lineLength;
      colors[3 * j + 1] = (this.lineColor.g * j) / this.lineLength;
      colors[3 * j + 2] = (this.lineColor.b * j) / this.lineLength;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    var material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
    });
    this.line = new THREE.Line(geometry, material);
  })();

  this.lineMoving = (isCircleLine) => {
    this.lineStartIndex++;

    if (isCircleLine) {
      this.lineStartIndex %= this.pathPointNums;
    } else {
      this.lineStartIndex %= this.pathPointNums - this.lineLength;
    }

    var positions = new Float32Array(this.lineLength * 3);
    var colors = new Float32Array(this.lineLength * 3);

    for (
      let i = this.lineStartIndex, j = 0;
      i < this.lineStartIndex + this.lineLength;
      i++, j++
    ) {
      if (isCircleLine) {
        var index = i % this.pathPointNums;
      } else {
        var index = i;
      }

      positions[3 * j] = this.pathPoints[index].x;
      positions[3 * j + 1] = this.pathPoints[index].y;
      positions[3 * j + 2] = this.pathPoints[index].z
        ? this.pathPoints[i].z
        : 0;

      colors[3 * j] = (this.lineColor.r * j) / this.lineLength;
      colors[3 * j + 1] = (this.lineColor.g * j) / this.lineLength;
      colors[3 * j + 2] = (this.lineColor.b * j) / this.lineLength;
    }

    this.line.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.line.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    this.line.geometry.verticesNeedUpdate = true;
  };

  setInterval(() => {
    this.lineMoving(isCircleLine);
  }, 100 / this.moveSpeed);

  return this.line;
}

function addStats() {
  //stat.js显示运行状态
  stats = new Stats();
  stats.showPanel(0);
  stats.dom.style.position = "absolute";
  stats.dom.style.left = "0px";
  stats.dom.style.top = "0px";
  document.getElementById("container").appendChild(stats.dom);
}

function animate() {
  stats.begin();
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

//resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
