// Three
import * as THREE from 'three';
// Animation in world space
import { AnimationWorld } from './AnimationWorld';
// Utils
import { extractWorldTracks } from '../utils/extractWorldTrack';

//////////
// BEGIN
export const Animation = ({
  mesh,
  object
  }) => {
  const animationMixer = new THREE.AnimationMixer(object);
  const animationActionsMap = new Map();
  const animationWorld = AnimationWorld({ worldMesh: mesh });
  const { positionMap, quaternionMap } = extractWorldTracks({ worldTrackName: 'TrajectorySHJnt', source: object });
  let activeAction;
  let animationMixerFinishedCallback;
  let _deltaSeconds = 0;

  // MAP ANIMATION ACTIONS TO CLIP NAMES
  object.animations.forEach(animClip => animationActionsMap.set(animClip.name, animationMixer.clipAction(animClip)));
  // INIT WORLD ANIMATION ANCHOR
  animationWorld.initTracks({ quaternionMap, positionMap });

  // SET ANIMATION MIXER CALLBACK
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