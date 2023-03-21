import * as THREE from 'three';
import { Position } from '../Position';

export const Animation = ({
  mesh,
  object,
  clipNames
  }) => {
  const animationMixer = new THREE.AnimationMixer(object);
  const animationActionsMap = new Map();
  let activeAction;
  let clipStartTime = 0;
  let animationMixerFinishedCallback;
  let positionMap = new Map();
  let position = Position({ mesh });
  let positionFlag = 0;

  // MAP ANIMATION NAMES TO SCRIPT CLIP NAMES
  object.animations.forEach(animObj => {
    clipNames.forEach(actionName => {
      let AnimationClip = animObj;
      if (animObj.name.indexOf(actionName) !== -1) {
        if (actionName === 'walk_loop') {
          AnimationClip.tracks = AnimationClip.tracks.map(track => {
            if (track.name !== 'TrajectorySHJnt.position') return track;
            const { times, values } = track;
            positionMap.set('walk_loop', {times, values});
            track.values = track.values.map(value => 0)
            return track;
          })
        }
        animationActionsMap.set(actionName, animationMixer.clipAction(AnimationClip));
      }
    });
  });

  position.initTracks(positionMap);

  const setAnimationMixerFinishedCallback = (newAnimationMixerFinishedCallback) => {
    animationMixer.removeEventListener('finished', animationMixerFinishedCallback);
    animationMixer.addEventListener('finished', newAnimationMixerFinishedCallback);
    animationMixerFinishedCallback = newAnimationMixerFinishedCallback;
  }

  const playClipAction = (clipName) => {
    positionFlag = 0;
    activeAction = animationActionsMap.get(clipName);
    if (clipName === 'walk_loop') {
      position.playTrack(clipName);
      positionFlag = 1;
    }
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .setLoop(THREE.LoopOnce)
      .play();
      clipStartTime = Date.now();
  }


  const update = ({ deltaSeconds, yRotation }) => {
    animationMixer.update(deltaSeconds);
    if (positionFlag === 1) position.update({ yRotation });
  }
  
  return {
    get clipStartTime() { return clipStartTime },
    playClipAction,
    setAnimationMixerFinishedCallback: (callback) => setAnimationMixerFinishedCallback(callback),
    clipAction: (clipName) => animationMixer.clipAction(clipName),
    update
  }

}