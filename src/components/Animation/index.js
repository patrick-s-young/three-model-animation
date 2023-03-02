import * as THREE from 'three';


export const Animation = ({
  gltf,
  clipActions
  }) => {
  const animationMixer = new THREE.AnimationMixer(gltf.scene);
  const animationClips = gltf.animations;
  const clipActionsMap = new Map();
  let previousAction;
  let activeAction;
  let clipStartTime = 0;
  let animationMixerFinishedCallback;

  animationClips.filter(ac => clipActions.includes(ac.name)).forEach(ac => clipActionsMap.set(ac.name, animationMixer.clipAction(ac)));

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