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
  let scriptState = {};
  let rotateFlag = 0;
  let clipStartTime = 0;

  animationClips.filter(ac => clipActions.includes(ac.name)).forEach(ac => clipActionsMap.set(ac.name, animationMixer.clipAction(ac)));
  animationMixer.addEventListener('finished', clipActionFinished);

  // START NEW SCRIPT
  function startNewScript (scriptName) {
    scriptState = {
      scriptName,
      clipNames: scripts[scriptName],
      scriptLength: scripts[scriptName].length,
      clipIdx: 0
    }
    playNextClipActionInScript();
  }

  function playNextClipActionInScript () {
    if (scriptState.scriptName === undefined) { console.log('scriptState.scriptName === undefined'); return; }
    const { clipIdx, clipNames } = scriptState;
    const { clipName } = clipNames[clipIdx];
    playClipAction(clipName); 
  }

  const playClipAction = (clipName) => {
    previousAction = activeAction;
    activeAction = clipActionsMap.get(clipName);
    if (previousAction === activeAction) return;
    if (previousAction !== undefined ) previousAction.stop();
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
      clipStartTime = Date.now();
  }

  function clipActionFinished (ev) {
    const { clipIdx, clipNames, scriptLength } = scriptState;
    const { clipName, loop, rotate } = clipNames[clipIdx];
    rotateFlag = rotate;
    scriptState.clipIdx = (clipIdx + 1) % scriptLength;
    playNextClipActionInScript();
  }


  const resetRotateFlag = () => rotateFlag = 0;

  const update = (deltaSeconds) => animationMixer.update(deltaSeconds);
  
  return {
    get clipStartTime() { return clipStartTime },
    get rotateFlag() { return rotateFlag },
    resetRotateFlag,
    startNewScript,
    playClipAction,
    update
  }

}