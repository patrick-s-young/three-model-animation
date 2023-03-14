import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// Components
import { Animation } from '../Animation';
import { Rotation } from '../Rotation';
import { Translation } from '../Tanslation';
import { TranslationLoop } from '../TranslationLoop';
import { ScriptPlayer } from '../ScriptPlayer';


export function Character({ 
  assetPath, 
  meshScaler }, 
  ANIMATION_CONFIGS,
  onLoadCallback) {
  // LOADER
  const fbxLoader = new FBXLoader();
  // MESH
  const mesh = new THREE.Group();
  mesh.matrixAutoUpdate = true;
  mesh.visible = true;
  // ANIMATION HANDLER
  let animationMixer;
  // ROTATION HANDLER
  let rotation = Rotation({ mesh, defaultRotation: 0 });
  // TRANSLATION HANDLERS
  let translation = Translation({ mesh, defaultPosition: [0, 0, 0] });
  let translationLoop = TranslationLoop({ mesh });
  // SCRIPT PLAYER
  let scriptPlayer;

  

  fbxLoader.load(assetPath, (object) => {
    object.scale.multiplyScalar(meshScaler)
    object.traverse((node) => { if (node.isMesh) node.castShadow = true });
    object.position.set(0, 0, 0);
    mesh.add(object);
    console.log('object', object)
    animationMixer = Animation({ object, clipNames: ANIMATION_CONFIGS.clipNames });
    scriptPlayer = ScriptPlayer({ animationMixer, configs: ANIMATION_CONFIGS });
    if (onLoadCallback !== undefined) onLoadCallback();
  })



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
    if (scriptPlayer?.timelineFlag === 1) {
      const clipTime = Date.now() - animationMixer?.clipStartTime;
      if (clipTime > 1) { 
        translationLoop.setTimeline(scriptPlayer.timeline);
        scriptPlayer.startTimeline();
      }
    }

    if (scriptPlayer?.timelineFlag === 2) translationLoop.update({ yRotation: rotation.y })
  }


  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    update
  }
}
