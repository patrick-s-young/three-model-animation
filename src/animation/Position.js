// TODO - import meshScaler from configs
const meshScaler = 0.1;
import * as THREE from 'three';
// Math
import { getYAxisDirectionVector } from '../math';

export const Position = ({ mesh }) => {
  let activeTrackName;
  let startAnimationTime;
  let accumulatedAnimationTime;
  let accumulatedDistance;
  let times;
  let values;
  let positionMap;
  const vectorInterpolant = {};

// INIT ALL POSITION TRACKS
  const initTracks = (_positionMap) => {
    positionMap = _positionMap;
    for (let [key, tracks] of positionMap.entries()) {
      const { times, values } = tracks;
       const vectorKeyFrameTrack = new THREE.VectorKeyframeTrack(key, times, values.map(value => value * meshScaler));
       vectorInterpolant[key] = vectorKeyFrameTrack.InterpolantFactoryMethodLinear();
    }
  }


// PLAY TRACK
  const playTrack = ({ deltaSeconds, trackName }) => {
    if (positionMap.has(trackName) === false) return;
    activeTrackName = trackName;
    const track = positionMap.get(trackName);
    times = track.times;
    values = track.values;
    startAnimationTime = deltaSeconds;
    accumulatedAnimationTime = 0;
    accumulatedDistance = 0;
  }

// UPDATE ACTIVE TRACK
  const update = ({ deltaSeconds, yRotation }) => {
    accumulatedAnimationTime += deltaSeconds;
    const timeOffset = accumulatedAnimationTime - startAnimationTime;
    for (let idx = 0, nTracks = times.length; idx < nTracks; idx++) {
      if (times[idx - 1] < timeOffset && times[idx] > timeOffset) {
        const [x, y, z] = vectorInterpolant[activeTrackName].interpolate_(idx, times[idx - 1], timeOffset, times[idx]);
        const increment = z - accumulatedDistance;
        accumulatedDistance += increment;
        const { x: xDirection, _ , z:zDirection } = getYAxisDirectionVector(yRotation);
        mesh.position.x += xDirection * increment;
        mesh.position.z += zDirection * increment * -1;
        break;
      }
    }
  }

  


  return {
    update,
    playTrack,
    initTracks
  }
}