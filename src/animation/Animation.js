// Three
import * as THREE from 'three';
// Animation in world space
import { AnimationMixerWorld } from './AnimationMixerWorld';
// Utils
import { transferTracks } from '../utils/transferTracks';
import { normalizeClipNames } from '../utils/normalizeClipNames';


//////////
// BEGIN
export const Animation = ({
  mesh,
  object,
  clipNames: normalizedClipNames,
 extractTracks: tracksToTransfer
  }) => {
  let activeAction;
  let animationMixerFinishedCallback;;
  let _deltaSeconds = 0;

  normalizeClipNames({
    object3D: object,
    normalizedClipNames
  });

  transferTracks ({
    sourceObj3D: object,
    targetObj3D: mesh,
    transferTracksByClipName: tracksToTransfer
  });

  const animationMixer = new THREE.AnimationMixer(object);
  const animationActionsMap = new Map();
  object.animations.forEach(animClip => animationActionsMap.set(animClip.name, animationMixer.clipAction(animClip)));


  const animationMixerWorld = AnimationMixerWorld({ worldMesh: mesh });

  const setAnimationMixerFinishedCallback = (newAnimationMixerFinishedCallback) => {
    animationMixer.removeEventListener('finished', animationMixerFinishedCallback);
    animationMixer.addEventListener('finished', newAnimationMixerFinishedCallback);
    animationMixerFinishedCallback = newAnimationMixerFinishedCallback;
  }

  const playClipAction = (clipName) => {
    mesh.visible = true;
    // positionFlag = 0;
    // quaternionFlag = 0;
    activeAction?.stop();
    activeAction = animationActionsMap.get(clipName);
    animationMixerWorld.playClipAction(clipName);
   // animationWorld.playClipAction({ clipName, deltaSeconds: _deltaSeconds });
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
  }


  const update = ({ deltaSeconds }) => {
    _deltaSeconds = deltaSeconds;
    animationMixer.update(_deltaSeconds);
    animationMixerWorld.update(_deltaSeconds);
  }
  
  return {
    playClipAction,
    setAnimationMixerFinishedCallback: (callback) => setAnimationMixerFinishedCallback(callback),
    clipAction: (clipName) => animationMixer.clipAction(clipName),
    update
  }

}