import * as THREE from 'three';
import { TMap } from '../types';

export const getField = (
    map: TMap,
    depth: number = 0.1,
): THREE.Group<THREE.Object3DEventMap> => {
    const field = new THREE.Group();

    const texture = new THREE.TextureLoader().load('/textures/floor.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;

    const fieldBoxGeometry = new THREE.BoxGeometry(1, 1, depth);
    const fieldBoxMaterial = new THREE.MeshStandardMaterial({
        map: texture,
    });

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const fieldBox = new THREE.Mesh(fieldBoxGeometry, fieldBoxMaterial);
            fieldBox.castShadow = false;
            fieldBox.receiveShadow = true;
            fieldBox.position.set(x, y, -depth);
            field.add(fieldBox);
        }
    }

    return field;
};
