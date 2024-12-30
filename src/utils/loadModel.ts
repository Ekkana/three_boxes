import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const loadModel = (url: string): Promise<GLTF> => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => resolve(gltf), // Resolve on successful load
      undefined, // Optional: progress callback
      (error) => reject(error), // Reject on error
    );
  });
};
