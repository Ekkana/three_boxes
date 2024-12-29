import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { parseInputFromFile } from './utils/parseInput';
import { getWalls } from './draw/walls';
import { getField } from './draw/field';
import { getBoxes } from './draw/boxes';
import { getRobot } from './draw/robot';
import { makeMove } from './utils/moveAlgo';
import { TBoxPosition } from './types';

let [map, moves, robotPosition] = await parseInputFromFile('/map1.txt');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(4, 0, 7);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#draw') as HTMLCanvasElement,
});

renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const light = new THREE.PointLight(0xffffff, 500);
light.castShadow = true;
light.position.set(-5, 0, 17);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

//const lightHelper = new THREE.PointLightHelper(light);
//scene.add(lightHelper);
//// red is x, green is y, blue is z
//const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(4, 4, 0);

const fieldWidth = 0.1;
scene.add(getField(map, fieldWidth));
scene.add(getWalls(map));

const boxOffset = fieldWidth + 0.5;
const boxes = getBoxes(map, boxOffset);
for (const [x, y, depthPosition, box] of Object.values(boxes)) {
  box.position.set(x, y, depthPosition);
  scene.add(box);
}

const robot = getRobot(robotPosition, fieldWidth + 0.5);
scene.add(robot);

const clock = new THREE.Clock();
let counter = 0;
let i = 0;

let boxesToMove: Record<string, TBoxPosition> = {};

const easeInOutQuart = (x: number) => {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
};
const speed = 0.2;

let robotOldPosition = robotPosition;
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  counter += clock.getDelta();
  if (counter > speed && i < moves.length) {
    const [newMap, newRobotPos, movedBoxes] = makeMove(
      map,
      moves[i],
      robotPosition,
    );
    map = newMap;
    robotOldPosition = robotPosition;
    robotPosition = newRobotPos;
    boxesToMove = movedBoxes;
    counter = 0;
    i++;
  }

  if (Object.entries(boxesToMove).length > 0) {
    robot.position.lerpVectors(
      new THREE.Vector3(
        robotOldPosition.y,
        robotOldPosition.x,
        boxOffset,
      ),
      new THREE.Vector3(robotPosition.y, robotPosition.x, boxOffset),
      easeInOutQuart(counter / speed),
    );
  } else {
    robot.position.lerpVectors(
      new THREE.Vector3(
        robotOldPosition.y,
        robotOldPosition.x,
        boxOffset,
      ),
      new THREE.Vector3(robotPosition.y, robotPosition.x, boxOffset),
      counter / speed,
    );
  }

  for (const [idx, newPos] of Object.entries(boxesToMove)) {
    boxes[idx][3].position.lerpVectors(
      new THREE.Vector3(newPos.oldY, newPos.oldX, boxOffset),
      new THREE.Vector3(newPos.y, newPos.x, boxOffset),
      easeInOutQuart(counter / speed),
    );
  }

  renderer.render(scene, camera);
}
animate();
