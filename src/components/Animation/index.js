import * as THREE from 'three';


export const Animation = (
  gltf,
  { clipActions,
    scripts
  }) => {
  const animationMixer = new THREE.AnimationMixer(gltf.scene);
  const animationClips = gltf.animations;
  const clipActionsMap = new Map();
  let previousAction;
  let activeAction;
  let scriptState;
  let rotateFlag = 0;
  let clipStartTime = 0;

  animationClips.filter(ac => clipActions.includes(ac.name)).forEach(ac => clipActionsMap.set(ac.name, animationMixer.clipAction(ac)));
  animationMixer.addEventListener('finished', scriptPlayNext);

  function resetScriptState() {
    scriptState = {
      scriptName: undefined,
      clipNames: [],
      clipIdx: 0,
      scriptLength: undefined
    }
  }

  const setScriptClipAction = (clipName, rotate) => {
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
      clipStartTime = Date.now();

  }

  function scriptPlayNext (ev) {
    if (scriptState.scriptName === undefined) return;
    const { clipIdx, scriptLength, clipNames } = scriptState;
    const { clipName, loop, rotate } = clipNames[clipIdx];
    rotateFlag = rotate;
    setScriptClipAction(clipName); 
    scriptState.clipIdx = (clipIdx + 1) % scriptLength;
  }

  return {
    clipStartTime,
    rotateFlag,
    scriptPlay,
    update: animationMixer.update
  }

}