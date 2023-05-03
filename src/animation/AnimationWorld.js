// Three
import * as THREE from 'three';
// Math
import { getYAxisDirectionVector } from '../math'; // TODO - add directory aliasing

const meshScaler = 0.1; // TODO - move to configs

//////////
// BEGIN
export const AnimationWorld = ({
  worldMesh
}) => {
  // Currently playing
  let activeTrackName = undefined;
  // Clip times
  let positionTrackTimes = [];
  let accumulatedAnimationTime = 0;
  let startAnimationTime = 0;
  // Position
  const vectorInterpolant = {};
  let accumulatedDistance = 0;
  let positionMap;
  // Quaterion
  let quaternionTrackTimes = [];
  let quaternionMap;
  let yRadians = 0;
  const quaternionInterpolant = {};
  const startQuat = new THREE.Quaternion();
  const interpolatedQuat = new THREE.Quaternion();
  const startPlusInterpolatedQuat = new THREE.Quaternion();


  const initTracks = ({ quaternionMap:quatMap, positionMap:posMap }) => {
    _initPositionTracks(posMap);
    _initQuaternionTracks(quatMap);
  }

  const playClipAction = ({ clipName, deltaSeconds }) => {
    activeTrackName = clipName;
    startAnimationTime = deltaSeconds;
    accumulatedAnimationTime = 0;
    positionTrackTimes = positionMap.get(clipName).times;
    accumulatedDistance = 0;
    quaternionTrackTimes = quaternionMap.get(clipName).times;
    startQuat.copy(worldMesh.quaternion);
  }


  const update = (deltaSeconds) => {
    accumulatedAnimationTime += deltaSeconds;
    const timeOffset = accumulatedAnimationTime - startAnimationTime;
    for (let idx = 1, nTracks = positionTrackTimes.length; idx < nTracks; idx++) {
      if (positionTrackTimes[idx - 1] < timeOffset && positionTrackTimes[idx] > timeOffset) {
          const [x, y, z] = vectorInterpolant[activeTrackName].interpolate_(idx, positionTrackTimes[idx - 1], timeOffset, positionTrackTimes[idx]);
          const increment = z - accumulatedDistance;
          accumulatedDistance += increment;
          const { x: xDirection, _ , z:zDirection } = getYAxisDirectionVector(yRadians);
          worldMesh.position.x += xDirection * increment;
          worldMesh.position.z += zDirection * increment * -1;
          break;
      }
    }
    for (let idx = 1, nTracks = quaternionTrackTimes.length; idx < nTracks; idx++) {
      if (quaternionTrackTimes[idx - 1] < timeOffset && quaternionTrackTimes[idx] > timeOffset) {
        const [x, y, z, w] = quaternionInterpolant[activeTrackName].interpolate_(idx, quaternionTrackTimes[idx - 1], timeOffset, quaternionTrackTimes[idx]);
        interpolatedQuat.set(x, y, z, w);
        startPlusInterpolatedQuat.multiplyQuaternions(startQuat, interpolatedQuat);
        worldMesh.quaternion.copy(startPlusInterpolatedQuat);
        _setYRotation();
        break;
      }
    }
    
  }


  // Position tracks to VectorKeyframeTrack
  const _initPositionTracks = (_positionMap) => {
    positionMap = _positionMap;
    for (let [key, tracks] of positionMap.entries()) {
      const { times, values } = tracks;
       const vectorKeyFrameTrack = new THREE.VectorKeyframeTrack(key, times, values.map(value => value * meshScaler));
       vectorInterpolant[key] = vectorKeyFrameTrack.InterpolantFactoryMethodLinear();
    }
  }

  // Quaternion tracks to QuaternionKeyframeTrack
  const _initQuaternionTracks = (_quaternionMap) => {
    quaternionMap = _quaternionMap;
    for (let [key, tracks] of quaternionMap.entries()) {
      const { times, values } = tracks;
      const quaternionKeyframeTrack = new THREE.QuaternionKeyframeTrack(key, times, values);
      quaternionInterpolant[key] = quaternionKeyframeTrack.InterpolantFactoryMethodLinear();
    }
  }
  
  // TODO - move to math utils
  function _setYRotation() {
    const [x, yNow, z, w] = worldMesh.quaternion.toArray();
      const angle = 2 * Math.acos(w);
      let s;
      if (1 - w * w < 0.000001) {
        s = 1;
      } else {
        s = Math.sqrt(1 - w * w);
      }
      yRadians = yNow/s * angle;
  }

  return {
    update,
    playClipAction,
    initTracks
  }
}