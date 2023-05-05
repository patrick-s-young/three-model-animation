// Three
import * as THREE from 'three';

export const extractWorldTracks = ({
  worldTrackName,
  source
}) => {
  const positionMap = new Map();
  const quaternionMap = new Map();
  source.animations.forEach(animClip => {
    let worldPositionKeyFrameTrack;
    animClip.tracks = animClip.tracks.filter(track => {
      const [name, type] = track.name.split('.');
      if (name === worldTrackName) {
        const { times, values } = track;
        if (type === 'position') {
          positionMap.set(animClip.name, {times, values});
          worldPositionKeyFrameTrack = new THREE.VectorKeyframeTrack(`${worldTrackName}.position`, [...times], new Array(values.length).fill(0));
        }
        if (type === 'quaternion') quaternionMap.set(animClip.name, {times, values});
       return false;
      }
      return true;
    });
    animClip.tracks.push(worldPositionKeyFrameTrack)
  });
  return { positionMap, quaternionMap };
}