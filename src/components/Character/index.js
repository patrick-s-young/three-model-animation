import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Configs
import { CONFIGS } from './configs';


export function Character(onLoadCallback) {
  // LOADER
  const gltfLoader = new GLTFLoader();
  // MODEL
  const mesh = new THREE.Group();
  mesh.name = CONFIGS.name;
  mesh.matrixAutoUpdate = true;
  mesh.visible = CONFIGS.defaultVisible;
  mesh.position.set(0, 0, 0);
  const assetPath = CONFIGS.assetPath;
  const meshScaler = CONFIGS.meshScaler;
  const defaultClipAction = CONFIGS.defaultClipAction;
  // ANIMATION
  let animationMixer;
  let animationClips;
  let previousAction;
  let activeAction;
  const fadeIn = CONFIGS.fadeIn;
  const clipActions = CONFIGS.clipActions;
  const clipActionsMap = new Map();
  const scripts = CONFIGS.scripts;
  // DIRECTION
  const yRotateAngle = new THREE.Vector3(0, 1, 0);
  const yRotateQuaternion = new THREE.Quaternion();
  const turningIncrement = CONFIGS.turningIncrement;
  let yPrev;
  let targetRadians;
  let xDirection;
  let zDirection;
  // SPEED
  let speed = 0;
  const walkingSpeed = CONFIGS.walkingSpeed;
  const runningSpeed = CONFIGS.runningSpeed;
  const speedScaler = CONFIGS.speedScaler;


  setDirection(0);

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animationMixer = new THREE.AnimationMixer(model);
    animationMixer.addEventListener('finished', scriptPlayNext);
    animationClips = gltf.animations;
    animationClips.filter(ac => clipActions.includes(ac.name)).forEach(ac => clipActionsMap.set(ac.name, animationMixer.clipAction(ac)));
    scriptPlay('sit');
    if (onLoadCallback !== undefined) onLoadCallback();
  });

  let scriptState;

  function resetScriptState() {
    scriptState = {
      scriptName: undefined,
      clipNames: [],
      clipIdx: 0,
      scriptLength: undefined
    }
  }


  /////////////////////////////////////
  // SET ANIMATION, VELOCITY, DIRECTION
  const setScriptClipAction = (clipName) => {
    console.log('play:', clipName)
    previousAction = activeAction;
    activeAction = clipActionsMap.get(clipName);

    // TRANSITION TO NEW CLIP ACTION
    if (previousAction === activeAction) return;
    if (previousAction !== undefined ) previousAction.stop();
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      //.fadeIn(fadeIn)
      .play();
  }

  function scriptPlayNext (ev) {
    if (scriptState.scriptName === undefined) return;
    const { clipIdx, scriptLength, clipNames } = scriptState;
    const { clipName, loop } = clipNames[clipIdx];
    setScriptClipAction(clipName); 
    scriptState.clipIdx = (clipIdx + 1) % scriptLength;
  }

  function scriptPlay (scriptName) {
    scriptState = {
      scriptName,
      clipNames: scripts[scriptName],
      scriptLength: scripts[scriptName].length,
      clipIdx: 0
    }
    scriptPlayNext('initScriptPlay')
  }

  const setClipAction = (clipActionName) => {
    if (scriptState.scriptName !== undefined) resetScriptState();
    previousAction = activeAction;
    activeAction = clipActionsMap.get(clipActionName);
    // TRANSITION TO NEW CLIP ACTION
    if (previousAction === activeAction) return;
    if (previousAction !== undefined ) previousAction.stop();
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
    // SET NEW SPEED
    if (clipActionName === defaultClipAction) {
      speed = 0;
    } else if (clipActionName === 'Walk') {
      speed = walkingSpeed * speedScaler;
    } else {
      speed = runningSpeed * speedScaler;
    }
  }

  // SET DIRECTION
  function setDirection (radians) {
    targetRadians = radians;
    yRotateQuaternion.setFromAxisAngle(yRotateAngle, targetRadians);
  }
  // SET POSITION TO HIT TEST RESULTS
  const setMatrixFromArray = (matrixArray) => {
    mesh.position.set(...matrixArray);
    mesh.visible = true;
    //mesh.matrix.fromArray(matrixArray);
  }



  ////////////////////////////////////////
  // UPDATE ANIMATION, POSITION, DIRECTION
  const updateMixer = (deltaSeconds) => {
      animationMixer?.update(deltaSeconds);
  }
  const updateRotation = () => {
    mesh.quaternion.rotateTowards(yRotateQuaternion, turningIncrement);
    const [x, yNow, z, w] = mesh.quaternion.toArray();
    if (yNow !== yPrev) {
      const angle = 2 * Math.acos(w);
      let s;
      if (1 - w * w < 0.000001) {
        s = 1;
      } else {
        s = Math.sqrt(1 - w * w);
      }
      const yAngle = yNow/s * angle;
      xDirection= Math.sin(-yAngle);
      zDirection = Math.cos(yAngle);
      yPrev = yNow;
    }
  }
  const updatePosition = () => {
    mesh.position.x += xDirection * speed;
    mesh.position.z -= zDirection * speed;
  }
  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    updateMixer(deltaSeconds);
    updateRotation();
    updatePosition();
  }
//
////////////////////////

  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    get clipActionsMap() { return clipActionsMap },
    update,
    setMatrixFromArray,
    setClipAction,
    setDirection
  }
}
