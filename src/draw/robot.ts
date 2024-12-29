import * as THREE from 'three';
import { TPosition } from '../types';

export const getRobot = (
  position: TPosition,
  depthPosition: number = 1,
): THREE.Mesh<any, THREE.MeshStandardMaterial, THREE.Object3DEventMap> => {
  const robotBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const robotBoxMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00ff,
  });
  const robotBox = new THREE.Mesh(robotBoxGeometry, robotBoxMaterial);

  robotBox.position.set(position.y, position.x, depthPosition);
  robotBox.castShadow = true;
  robotBox.receiveShadow = true;

  return robotBox;
};
