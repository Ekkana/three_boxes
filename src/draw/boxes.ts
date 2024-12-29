import * as THREE from 'three';
import { TMap } from '../types';

type TBoxData = [
  number,
  number,
  number,
  THREE.Mesh<
    THREE.BoxGeometry,
    THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
  >,
];

type TBox = Record<string, TBoxData>;

export const getBoxes = (map: TMap, depthPosition: number = 1): TBox => {
  const boxes: TBox = {};

  const boxBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxBoxMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
  });

  console.log('getting boxes', map);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (typeof map[y][x] === 'number') {
        const boxBox = new THREE.Mesh(boxBoxGeometry, boxBoxMaterial);
        boxBox.castShadow = true;
        boxBox.receiveShadow = true;
        boxes[map[y][x]] = [x, y, depthPosition, boxBox];
      }
    }
  }

  return boxes;
};
