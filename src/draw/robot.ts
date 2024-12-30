import * as THREE from 'three';
import { TPosition } from '../types';
import { loadModel } from '../utils/loadModel';

export const getRobot = async (
    position: TPosition,
    depthPosition: number = 1,
): Promise<[THREE.Group<THREE.Object3DEventMap>, THREE.AnimationMixer]> => {
    let robotBox: THREE.Group<THREE.Object3DEventMap>;

    const robot = await loadModel('/models/RobotExpressive.glb');
    robotBox = robot.scene;

    const animations = robot.animations;
    const mixer = new THREE.AnimationMixer(robotBox);
    const runAnimation = animations.find((a) => a.name === 'Running')!;
    console.log('runAnimation', runAnimation);

    const runAction = mixer.clipAction(runAnimation);
    runAction.play();

    robotBox.traverse((object: THREE.Object3D) => {
        object.castShadow = true;
        object.receiveShadow = true;
    });
    //robotBox.position.set(position.y, position.x, depthPosition);
    robotBox.scale.set(0.4, 0.4, 0.4);
    robotBox.rotation.x = Math.PI / 2;
    robotBox.rotation.y = -Math.PI / 2;

    return [robotBox, mixer];
};
