import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// Components
import { Animation } from '../Animation';
import { Rotation } from '../Rotation';
import { Translation } from '../Tanslation';
import { ScriptPlayer } from '../ScriptPlayer';


export function Character({ 
  assetPath, 
  meshScaler }, 
  ANIMATION_CONFIGS,
  onLoadCallback) {
  // LOADER
  const gltfLoader = new GLTFLoader();
  const fbxLoader = new FBXLoader();
  // MESH
  const mesh = new THREE.Group();
  mesh.matrixAutoUpdate = true;
  mesh.visible = true;
  // ANIMATION HANDLER
  let animationMixer;
  // ROTATION HANDLER
  let rotation = Rotation({ mesh, defaultRotation: 0 });
  // TRANSLATIONS HANDLER
  let translation = Translation({ mesh, defaultPosition: [0, 0, 0] });
  // SCRIPT PLAYER
  let scriptPlayer;

  //gltfLoader.load(assetPath, onGltfLoaded);

  fbxLoader.load(assetPath, (object) => {
    object.scale.multiplyScalar(0.1)
    object.traverse((node) => { if (node.isMesh) node.castShadow = true });
    object.position.set(0, 0, 0);
    mesh.add(object);
    console.log('object', object)
    animationMixer = Animation({ object, clipActions: ANIMATION_CONFIGS.clipActions });
    scriptPlayer = ScriptPlayer({ animationMixer, configs: ANIMATION_CONFIGS });
    if (onLoadCallback !== undefined) onLoadCallback();
  })

  function onGltfLoaded (gltf) {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animationMixer = Animation({ gltf, clipActions: ANIMATION_CONFIGS.clipActions });
    scriptPlayer = ScriptPlayer({ animationMixer, configs: ANIMATION_CONFIGS });
    if (onLoadCallback !== undefined) onLoadCallback();
  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    // UPDATE ANIMATION
    animationMixer?.update(deltaSeconds);
    // CHECK FOR ROTATION
    if (scriptPlayer?.rotateFlag !== 0) {
      const clipTime = Date.now() - animationMixer?.clipStartTime;
      if (clipTime > 1) { 
        rotation.y = scriptPlayer.rotateFlag;
        scriptPlayer.resetRotateFlag()
      }
    }
    // CHECK FOR TRANSLATION
    if (scriptPlayer?.translateFlag !== 0) {
      const clipTime = Date.now() - animationMixer?.clipStartTime;
      if (clipTime > 1) { 
        translation.setXZPosition({ distance: scriptPlayer.translateFlag, yRotation: rotation.y });
        scriptPlayer.resetTranslateFlag();
      }
    }
  }


  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    update
  }
}
