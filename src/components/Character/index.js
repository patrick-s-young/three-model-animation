import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Components
import { Animation } from '../Animation';
import { Rotation } from '../Rotation';


export function Character({ 
  assetPath, 
  meshScaler }, 
  ANIMATION_CONFIGS,
  onLoadCallback) {
  // MESH
  const gltfLoader = new GLTFLoader();
  const mesh = new THREE.Group();
  mesh.matrixAutoUpdate = true;
  mesh.visible = true;
  mesh.position.set(0, 0, 0);
  // ANIMATION HANDLER
  let animationMixer;
  // ROTATION HANDLER
  let rotation = Rotation({ mesh, defaultRotation: 0 });

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animationMixer = Animation(gltf, ANIMATION_CONFIGS);
    animationMixer.scriptPlay('idle');
    if (onLoadCallback !== undefined) onLoadCallback();
  });

  // SET POSITION TO HIT TEST RESULTS
  const setMatrixFromArray = (matrixArray) => {
    mesh.position.set(...matrixArray);
    mesh.visible = true;
  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    animationMixer?.update(deltaSeconds);
    
    if (animationMixer?.rotateFlag !== 0) {
      const clipTime = Date.now() - animationMixer?.clipStartTime;
      if (clipTime > 1) { 
        rotation.y = animationMixer?.rotateFlag;
        animationMixer.resetRotateFlag()
      }
    }
  }


  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    update,
    setMatrixFromArray
  }
}
