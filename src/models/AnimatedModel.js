// THREE
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// Components
import { Animation } from '../animation/Animation';
import { ScriptPlayer } from '../animation/ScriptPlayer';


export function AnimatedModel({ 
  assetPath, 
  meshScaler }, 
  ANIMATION_CONFIGS,
  onLoadCallback) {
  // LOADER
  const fbxLoader = new FBXLoader();
  // MESH
  const mesh = new THREE.Group();
  mesh.matrixAutoUpdate = true;
  mesh.visible = false;
  // ANIMATION HANDLER
  let animation;
  // SCRIPT PLAYER
  let scriptPlayer;

  
  // LOAD MODEL
  fbxLoader.load(assetPath, (object) => {
    object.scale.multiplyScalar(meshScaler)
    object.traverse((node) => { if (node.isMesh) node.castShadow = true });
    object.position.set(0, 0, 0);
    mesh.add(object);
    animation = Animation({
       mesh, 
       object, 
       clipNames: ANIMATION_CONFIGS.clipNames,
      extractTracks: ANIMATION_CONFIGS.extractTracks 
    });
    scriptPlayer = ScriptPlayer({ 
      object, 
      animation: animation,
      configs: ANIMATION_CONFIGS });
    if (onLoadCallback !== undefined) onLoadCallback();
  })


  // CHARACTER ANIMATION LOOP
  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    // UPDATE MIXER
    animation?.update({ deltaSeconds });
  }


  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    update
  }
}
