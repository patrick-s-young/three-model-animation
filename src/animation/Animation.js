// Three
import * as THREE from 'three';
// Animation in world space
import { AnimationWorld } from './AnimationWorld';

//////////
// BEGIN
export const Animation = ({
  mesh,
  object,
  clipNames,
  extractTracks
  }) => {
  const animationMixer = new THREE.AnimationMixer(object);
  const animationActionsMap = new Map();
  let activeAction;
  let animationMixerFinishedCallback;
  const positionMap = new Map();
  let positionFlag = 0;
  const quaternionMap = new Map();
  let quaternionFlag = 0;
  let _deltaSeconds = 0;
  const animationWorld = AnimationWorld({ worldMesh: mesh });

  // MAP ANIMATION NAMES TO SCRIPT CLIP NAMES
  object.animations.forEach(animObj => {
    clipNames.forEach(actionName => {
      let AnimationClip = animObj;
      if (animObj.name.indexOf(actionName) !== -1) {
        AnimationClip = extractAnimationTrack(AnimationClip, actionName);
        animationActionsMap.set(actionName, animationMixer.clipAction(AnimationClip));
      }
    });

  });

  animationWorld.initTracks({ worldMesh: mesh, quaternionMap, positionMap });

  function extractAnimationTrack(animationClip, actionName) {
    if (extractTracks[actionName] === undefined) return animationClip;
    const { positionTrackName, quaternionTrackName } = extractTracks[actionName];
    animationClip.tracks = animationClip.tracks.map(track => {
        const { name, times, values } = track;
        if (name === positionTrackName) {
          positionMap.set(actionName, {times, values});
          track.values = track.values.map(value => 0);
        }
        if (name === quaternionTrackName) {
          quaternionMap.set(actionName, {times, values});
          track.values = track.values.map(value => 0);
        }
        return track;
      });
    return animationClip;
  }

  const setAnimationMixerFinishedCallback = (newAnimationMixerFinishedCallback) => {
    animationMixer.removeEventListener('finished', animationMixerFinishedCallback);
    animationMixer.addEventListener('finished', newAnimationMixerFinishedCallback);
    animationMixerFinishedCallback = newAnimationMixerFinishedCallback;
  }

  const playClipAction = (clipName) => {
    mesh.visible = true;
    positionFlag = 0;
    quaternionFlag = 0;
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