import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Components
import { Animation } from '../Animation';
import { Rotation } from '../Rotation';
import { Translation } from '../Tanslation';


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
  // ANIMATION HANDLER
  let animationMixer;
  // ROTATION HANDLER
  let rotation = Rotation({ mesh, defaultRotation: 0 });
  // TRANLATIONS HANDLER
  let translation = Translation({ mesh, defaultPosition: [0, 0, 0] });

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animationMixer = Animation(gltf, ANIMATION_CONFIGS);
    animationMixer.startNewScript('idle');
    if (onLoadCallback !== undefined) onLoadCallback();
  });



  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    // UPDATE ANIMATION
    animationMixer?.update(deltaSeconds);
    // CHECK FOR ROTATION
    if (animationMixer?.rotateFlag !== 0) {
      const clipTime = Date.now() - animationMixer?.clipStartTime;
      if (clipTime > 1) { 
        rotation.y = animationMixer?.rotateFlag;
        animationMixer.resetRotateFlag()
      }
    }
    // CHECK FOR TRANSLATION
    // if (translation?.moveToPosition !== null)
  }


  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    setPosition: (newPos) => translation.setPosition(newPos),
    update,
    //setMatrixFromArray
  }
}
