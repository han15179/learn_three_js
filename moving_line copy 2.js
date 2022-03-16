import Stats from "../node_modules/stats.js/src/Stats.js";

var scene, camera, renderer;
var stats;
var linesData = [];
var linesGroup;

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
  linesGroup = new THREE.Group();

  let line1 = FlowingLine(
    new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, -30, 0),
        new THREE.Vector3(-30, 0, 0),
        new THREE.Vector3(0, 30, 0),
        new THREE.Vector3(30, 0, 0),
      ],
      true
    ),
    null,
    null,
    null,
    true
  );
  linesGroup.add(line1.line);
  linesData.push(line1.Data);

  let line2 = FlowingLine(
    new THREE.EllipseCurve(0, 0, 30, 30, 0, Math.PI * 2, true, -Math.PI / 2),
    null,
    null,
    null,
    true
  );
  linesGroup.add(line2.line);
  linesData.push(line2.Data);

  for (let i = 0; i < 100; i++) {
    const t = FlowingLine(
      new THREE.EllipseCurve(0, 0, 20, 20, 0, Math.PI * 2, true),
      10,
      {
        r: 0.1 * i,
        g: 0.5,
        b: 0.5,
      },
      3,
      true
    );
    t.line.rotation.z = (Math.PI * 2 * i) / 100;
    linesGroup.add(t.line);
    linesData.push(t.Data);
  }

  scene.add(linesGroup);
  console.log(linesGroup);
}

function FlowingLine(linePath, lineLength, lineColor, moveSpeed, isCircleLine) {
  let line = null;
  //线段路径
  let Path = linePath
    ? linePath
    : new THREE.CatmullRomCurve3([
        new THREE.Vector3(-100, 0, 0),
        new THREE.Vector3(100, 0, 0),
      ]);

  //线段颜色
  let Color = lineColor
    ? lineColor
    : {
        r: 0.2,
        g: 0.5,
        b: 0.8,
      };

  //路径上取点的个数
  let pathPointNums = 800;
  //运动线段的长度(点数)
  let Length = lineLength ? lineLength : 80;
  //线段开始的点的下标
  let lineStartIndex = 0;
  //线段的移动速度
  let Speed = moveSpeed ? moveSpeed : 4;
  //取点
  let pathPoints = Path.getPoints(pathPointNums);
  //复制一遍点,为了循环的线段
  pathPoints.push(...pathPoints);

  let positions = new Float32Array(Length * 3);
  let colors = new Float32Array(Length * 3);

  for (let i = lineStartIndex, j = 0; i < lineStartIndex + Length; i++, j++) {
    positions[3 * j] = pathPoints[i].x;
    positions[3 * j + 1] = pathPoints[i].y;
    positions[3 * j + 2] = pathPoints[i].z ? pathPoints[i].z : 0;

    colors[3 * j] = (Color.r * j) / Length;
    colors[3 * j + 1] = (Color.g * j) / Length;
    colors[3 * j + 2] = (Color.b * j) / Length;
  }

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  let material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
  });

  line = new THREE.Line(geometry, material);

  return {
    Data: {
      lineStartIndex: lineStartIndex,
      lineLength: Length,
      pathPointNums: pathPointNums,
      pathPoints: pathPoints,
      moveSpeed: Speed,
      isCircleLine: isCircleLine,
    },
    line: line,
  };
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

  let lines = linesGroup.children;
  for (let i = 0; i < lines.length; i++) {
    linesData[i].lineStartIndex += linesData[i].moveSpeed;
    if (linesData[i].isCircleLine) {
      linesData[i].lineStartIndex %= linesData[i].pathPointNums;
    } else {
      linesData[i].lineStartIndex %=
        linesData[i].pathPointNums - linesData[i].lineLength;
    }

    var positions = new Float32Array(linesData[i].lineLength * 3);

    for (
      let k = linesData[i].lineStartIndex, j = 0;
      k < linesData[i].lineStartIndex + linesData[i].lineLength;
      k++, j++
    ) {
      if (linesData[i].isCircleLine) {
        var index = k % linesData[i].pathPointNums;
      } else {
        var index = k;
      }

      positions[3 * j] = linesData[i].pathPoints[index].x;
      positions[3 * j + 1] = linesData[i].pathPoints[index].y;
      positions[3 * j + 2] = linesData[i].pathPoints[index].z
        ? linesData[i].pathPoints[index].z
        : 0;
    }
    lines[i].geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    lines[i].geometry.verticesNeedUpdate = true;
  }

  stats.end();
  requestAnimationFrame(animate);
}

//resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
