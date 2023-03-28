// TODO - import meshScaler from configs
const meshScaler = 0.1;
import * as THREE from 'three';

export const Position = ({ mesh }) => {
  let activeTrackName;
  let startAnimationTime;
  let accumulatedAnimationTime;
  let accumulatedDistance;
  let times;
  let values;
  let positionMap;
  const rotationCache = {};
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


// COMPUTE AND CACHE POSITION VECTOR
  const getVector = (yRotation) => {
    if (rotationCache?.[yRotation] !== undefined) return rotationCache[yRotation];
    const xDirection = Math.sin(-yRotation);
    const zDirection = Math.cos(yRotation);
    rotationCache[yRotation] = { xDirection, zDirection };
    return { xDirection, zDirection };
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
    for (let idx = 1; idx < times.length; idx++) {
      if (times[idx - 1] < timeOffset && times[idx] > timeOffset) {
        const [x, y, z] = vectorInterpolant[activeTrackName].interpolate_(idx, times[idx - 1], timeOffset, times[idx]);
        const increment = z - accumulatedDistance;
        accumulatedDistance += increment;
        const { xDirection, zDirection } = getVector(yRotation);
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