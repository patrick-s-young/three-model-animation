// Three
import * as THREE from 'three';

//////////
// BEGIN
export const AnimationMixerWorld = ({
  worldMesh,
  normalizedClipNames
}) => {
  let activeAction;
  const animationMixer = new THREE.AnimationMixer(worldMesh);
  const animationActionsMap = new Map();

  // Map normalized clip names to clipActions
  worldMesh.animations.forEach(animClip => {
    normalizedClipNames.forEach(normalizedClipName => {
      if (animClip.name.indexOf(normalizedClipName) !== -1)  animationActionsMap.set(normalizedClipName, animationMixer.clipAction(animClip))
    })
  });


  const playClipAction = (clipName) => {
    console.log('animationActionsMap.get(clipName):', animationActionsMap.get(clipName))
    activeAction?.stop();
    activeAction = animationActionsMap.get(clipName);
   // animationWorld.playClipAction({ clipName, deltaSeconds: _deltaSeconds });
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
  }


  return {
    update:(deltaSeconds) => animationMixer.update(deltaSeconds),
    playClipAction,
  }
}