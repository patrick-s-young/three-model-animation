// Three
import * as THREE from 'three';
// Animation in world space
import { AnimationWorld } from './AnimationWorld';
// Utils
import { normalizeClipNames } from '../utils/normalizeClipNames';

//////////
// BEGIN
export const Animation = ({
  mesh,
  object,
  clipNames
  }) => {

  normalizeClipNames({
    object3D: object,
    normalizedClipNames: clipNames
  });

  const animationMixer = new THREE.AnimationMixer(object);
  const animationActionsMap = new Map();
  let activeAction;
  let animationMixerFinishedCallback;
  const positionMap = new Map();
  const quaternionMap = new Map();
  let _deltaSeconds = 0;
  const animationWorld = AnimationWorld({ worldMesh: mesh });

  // MAP ANIMATION NAMES TO SCRIPT CLIP NAMES
  object.animations.forEach(animClip => {
     animClip.tracks = animClip.tracks.filter(track => {
       const [name, type] = track.name.split('.');
       if (name === 'TrajectorySHJnt') {
         const { times, values } = track;
         if (type === 'position') positionMap.set(animClip.name, {times, values});
         if (type === 'quaternion') quaternionMap.set(animClip.name, {times, values});
        return false;
       }
       return true;
     });
    animationActionsMap.set(animClip.name, animationMixer.clipAction(animClip));
  });

  animationWorld.initTracks({ worldMesh: mesh, quaternionMap, positionMap });


  const setAnimationMixerFinishedCallback = (newAnimationMixerFinishedCallback) => {
    animationMixer.removeEventListener('finished', animationMixerFinishedCallback);
    animationMixer.addEventListener('finished', newAnimationMixerFinishedCallback);
    animationMixerFinishedCallback = newAnimationMixerFinishedCallback;
  }

  const playClipAction = (clipName) => {
   
    mesh.visible = true;
    activeAction?.stop();
    activeAction = animationActionsMap.get(clipName);
    animationWorld.playClipAction({ clipName, deltaSeconds: _deltaSeconds });
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
    animationWorld.update(_deltaSeconds);
  }
  
  return {
    playClipAction,
    setAnimationMixerFinishedCallback: (callback) => setAnimationMixerFinishedCallback(callback),
    clipAction: (clipName) => animationMixer.clipAction(clipName),
    update
  }

}