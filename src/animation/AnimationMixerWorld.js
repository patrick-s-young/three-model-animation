// Three
import * as THREE from 'three';

//////////
// BEGIN
export const AnimationMixerWorld = ({
  worldMesh
}) => {
  let activeAction;
  const animationMixer = new THREE.AnimationMixer(worldMesh);
  const animationActionsMap = new Map();
  worldMesh.animations.forEach(animClip => animationActionsMap.set(animClip.name, animationMixer.clipAction(animClip)));


  const playClipAction = (clipName) => {
    activeAction?.stop();
    activeAction = animationActionsMap.get(clipName);
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
  }


  return {
    update:(deltaSeconds) => animationMixer.update(deltaSeconds),
    playClipAction
  }
}