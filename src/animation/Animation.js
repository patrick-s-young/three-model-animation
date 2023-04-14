// Three
import * as THREE from 'three';
// Animation in world space
import { AnimationMixerWorld } from './AnimationMixerWorld';


const tracksToTransfer = {
  stand_to_walk: { trackName: 'TrajectorySHJnt.position', trackType: 'position' },
  walk_to_stand: { trackName: 'TrajectorySHJnt.position', trackType: 'position' },
  turn_right_180: { trackName: 'TrajectorySHJnt.quaternion', trackType: 'quaternion' },
  turn_right_90: { trackName: 'TrajectorySHJnt.quaternion', trackType: 'quaternion' },
  turn_right_45: { trackName: 'TrajectorySHJnt.quaternion', trackType: 'quaternion' },
  walk_loop: { trackName: 'TrajectorySHJnt.position', trackType: 'position' },
  turn_left_45: { trackName: 'TrajectorySHJnt.quaternion', trackType: 'quaternion' }
}

//////////
// BEGIN
export const Animation = ({
  mesh,
  object,
  clipNames: normalizedClipNames
 // extractTracks: normalizedClipNames
  }) => {
  let activeAction;
  let animationMixerFinishedCallback;;
  let _deltaSeconds = 0;

  transferTracks ({
    sourceObj3D: object,
    targetObj3D: mesh,
    normalizedClipNames,
    transferTracksByClipName: tracksToTransfer
  });


  const animationMixer = new THREE.AnimationMixer(object);
  const animationActionsMap = new Map();
  // Map normalized clip names to clipActions
  object.animations.forEach(animClip => {
    normalizedClipNames.forEach(normalizedClipName => {
      if (animClip.name.indexOf(normalizedClipName) !== -1)  animationActionsMap.set(normalizedClipName, animationMixer.clipAction(animClip))
    })
  });

  const animationMixerWorld = AnimationMixerWorld({ worldMesh: mesh, normalizedClipNames });

  function transferTracks ({
    sourceObj3D,
    targetObj3D,
    normalizedClipNames,
    transferTracksByClipName
  }) {
    sourceObj3D.animations.forEach(sourceAnimClip => {
      // Does the sourceAnimClip have tracks to be transferred?
      normalizedClipNames.forEach(normalizedClipName => {
        if (sourceAnimClip.name.indexOf(normalizedClipName) !== -1 && transferTracksByClipName[normalizedClipName] !== undefined) {
          // clip with tracks to transfer has been found
          // loop over AnimationClip tracks to find the matching track name
          const targetAnimClip = new THREE.AnimationClip(normalizedClipName, sourceAnimClip.duration, []);
          const { trackName:targetTrackName, trackType } =  transferTracksByClipName[normalizedClipName];
          sourceAnimClip.tracks = sourceAnimClip.tracks.filter(sourceTrack => {
            //console.log('track:', track);
           //const { name, times, values } = sourceTrack;
            if (targetTrackName === sourceTrack.name) {
              targetAnimClip.tracks.push(sourceTrack);
              return false;
            }
            return true;
          });
          targetObj3D.animations.push(targetAnimClip);
        } 
        
      });
    })
    console.log('targetObj3D', targetObj3D);
    console.log('sourceObj3D', sourceObj3D);
  }



  //animationWorld.initTracks({ worldMesh: mesh, quaternionMap, positionMap });

  // function extractAnimationTrack(animationClip, actionName) {
  //   if (extractTracks[actionName] === undefined) return animationClip;
  //   const { positionTrackName, quaternionTrackName } = extractTracks[actionName];
  //   animationClip.tracks = animationClip.tracks.map(track => {
  //       const { name, times, values } = track;
  //       if (name === positionTrackName) {
  //         positionMap.set(actionName, {times, values});
  //         track.values = track.values.map(value => 0);
  //       }
  //       if (name === quaternionTrackName) {
  //         quaternionMap.set(actionName, {times, values});
  //         track.values = track.values.map(value => 0);
  //       }
  //       return track;
  //     });
  //   return animationClip;
  // }

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