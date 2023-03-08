import * as THREE from 'three';


export const Animation = ({
  object,
  clipActions
  }) => {
  const animationMixer = new THREE.AnimationMixer(object);
  const clipActionsMap = new Map();
  let previousAction;
  let activeAction;
  let clipStartTime = 0;
  let animationMixerFinishedCallback;

  // MAP ANIMATION NAMES TO SCRIPT CLIP NAMES
  object.animations.forEach(animObj => {
    clipActions.forEach(actionName => {
      if (animObj.name.indexOf(actionName) !== -1) {
        clipActionsMap.set(actionName, animationMixer.clipAction(animObj));
        // todo: removed matched clipActions from array
      }
    });
  });

  const setAnimationMixerFinishedCallback = (newAnimationMixerFinishedCallback) => {
    animationMixer.removeEventListener('finished', animationMixerFinishedCallback);
    animationMixer.addEventListener('finished', newAnimationMixerFinishedCallback);
    animationMixerFinishedCallback = newAnimationMixerFinishedCallback;
  }

  const playClipAction = (clipName) => {
    previousAction = activeAction;
    activeAction = clipActionsMap.get(clipName);
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
      clipStartTime = Date.now();
      previousAction?.stop();
  }


  const update = (deltaSeconds) => animationMixer.update(deltaSeconds);
  
  return {
    get clipStartTime() { return clipStartTime },
    playClipAction,
    setAnimationMixerFinishedCallback,
    update
  }

}