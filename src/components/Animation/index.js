import * as THREE from 'three';
import { Position } from '../Position';
import { Quaternion } from '../Quaternion';

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
  let position = Position({ mesh });
  let positionFlag = 0;
  const quaternionMap = new Map();
  const quaternion = Quaternion({ mesh });
  let quaternionFlag = 0;
  let _deltaSeconds = 0;

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


  position.initTracks(positionMap);
  quaternion.initTracks(quaternionMap);

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
    if (extractTracks[clipName] !== undefined) {
      const { positionTrackName, quaternionTrackName } = extractTracks[clipName];
      if (positionTrackName !== undefined) {
        position.playTrack({ deltaSeconds: _deltaSeconds, trackName: clipName });
        positionFlag = 1;
      }
      if (quaternionTrackName !== undefined) {
        quaternion.playTrack(clipName);
        quaternionFlag = 1;
      }
    }
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
    if (positionFlag === 1) position.update({ deltaSeconds: _deltaSeconds, yRotation: quaternion.yRadians });
    if (quaternionFlag === 1) quaternion.update();
  }
  
  return {
    playClipAction,
    setAnimationMixerFinishedCallback: (callback) => setAnimationMixerFinishedCallback(callback),
    clipAction: (clipName) => animationMixer.clipAction(clipName),
    update
  }

}