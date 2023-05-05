// THREE
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// Components
import { Animation } from '../animation/Animation';
import { ScriptPlayer } from '../animation/ScriptPlayer';
// Utils
import { normalizeClipNames } from '../utils/normalizeClipNames';

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
  // MESH DEBUG
  const geometry = new THREE.BoxGeometry( .2, .2, .2 ); 
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
  const cube = new THREE.Mesh( geometry, material );
  mesh.add(cube);
  // ANIMATION HANDLER
  let animation;
  // SCRIPT PLAYER
  let scriptPlayer;



  // LOAD MODEL
  fbxLoader.load(assetPath, (object) => {
    object.scale.multiplyScalar(meshScaler)
    object.traverse((node) => { if (node.isMesh) node.castShadow = true });
    object.position.set(0, 0, 0);
    normalizeClipNames({
      object3D: object,
      normalizedClipNames: ANIMATION_CONFIGS.clipNames
    });
    mesh.add(object);
    animation = Animation({
       mesh, 
       object
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
