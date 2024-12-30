import * as THREE from 'three';
import { WALL_SYMBOL } from '../constants';
import { TMap } from '../types';

export const getWalls = (
  map: TMap,
  depthPosition: number = 1,
): THREE.Group<THREE.Object3DEventMap> => {
  const walls = new THREE.Group();

  const texture = new THREE.TextureLoader().load('/textures/wall.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  //texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const wallBoxGeometry = new THREE.BoxGeometry(1, 1, 2);
  const wallBoxMaterial = new THREE.MeshStandardMaterial({
    map: texture,
  });
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === WALL_SYMBOL) {
        const wallBox = new THREE.Mesh(
          wallBoxGeometry,
          wallBoxMaterial,
        );
        wallBox.castShadow = true;
        wallBox.receiveShadow = true;
        wallBox.position.set(x, y, depthPosition);
        walls.add(wallBox);
      }
    }
  }

  return walls;
};
