import * as THREE from 'three';


export const Animation = ({
  object,
  clipNames
  }) => {
  const animationMixer = new THREE.AnimationMixer(object);
  const clipActionsMap = new Map();
  let previousAction;
  let activeAction;
  let activeLoop;
  let clipStartTime = 0;
  let animationMixerFinishedCallback;

  // MAP ANIMATION NAMES TO SCRIPT CLIP NAMES
  object.animations.forEach(animObj => {
    clipNames.forEach(actionName => {
      if (animObj.name.indexOf(actionName) !== -1) {
        clipActionsMap.set(actionName, animationMixer.clipAction(animObj));
      }
    });
  });
  
  console.log('clipActionsMap:', clipActionsMap)
  const setAnimationMixerFinishedCallback = (newAnimationMixerFinishedCallback) => {
    animationMixer.removeEventListener('finished', animationMixerFinishedCallback);
    animationMixer.addEventListener('finished', newAnimationMixerFinishedCallback);
    animationMixerFinishedCallback = newAnimationMixerFinishedCallback;
  }

  const playClipAction = (clipName) => {
    previousAction?.stop();
    activeAction = clipActionsMap.get(clipName);
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
      clipStartTime = Date.now();
    previousAction = activeAction;
  }


  const update = (deltaSeconds) => animationMixer.update(deltaSeconds);
  
  return {
    get clipStartTime() { return clipStartTime },
    playClipAction,
    setAnimationMixerFinishedCallback,
    update
  }

}