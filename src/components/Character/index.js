import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Components
import { Animation } from '../Animation';


export function Character({ 
  assetPath, 
  meshScaler }, 
  ANIMATION_CONFIGS,
  onLoadCallback) {
  // LOADER
  const gltfLoader = new GLTFLoader();
  // MODEL
  const mesh = new THREE.Group();
  mesh.matrixAutoUpdate = true;
  mesh.visible = true;
  mesh.position.set(0, 0, 0);
  // ANIMATION HANDLER
  let animationMixer;
  // DIRECTION
  const yRotateAngle = new THREE.Vector3(0, 1, 0);
  const yRotateQuaternion = new THREE.Quaternion();
  let targetRadians;


  setDirection(0);

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


  // SET DIRECTION
  function setDirection (radians) {
    targetRadians = radians;
    yRotateQuaternion.setFromAxisAngle(yRotateAngle, targetRadians);
    mesh.quaternion.copy(yRotateQuaternion)
  }

  // SET POSITION TO HIT TEST RESULTS
  const setMatrixFromArray = (matrixArray) => {
    mesh.position.set(...matrixArray);
    mesh.visible = true;
    //mesh.matrix.fromArray(matrixArray);
  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    animationMixer?.update(deltaSeconds);
    
    if (animationMixer?.rotateFlag !== 0) {
      console.log('animationMixer?.rotateFlag', animationMixer?.rotateFlag)
      const clipTime = Date.now() - animationMixer?.clipStartTime;
      if (clipTime > 1) { 
        setDirection(targetRadians + animationMixer?.rotateFlag);
        animationMixer.resetRotateFlag()
      }
    }
  }
//
////////////////////////

  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    update,
    setMatrixFromArray
  }
}
