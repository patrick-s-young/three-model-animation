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
  let clipTrackTimes = [];
  let accumulatedAnimationTime = 0;
  let startAnimationTime = 0;
  // Position
  let positionFlag;
  const vectorInterpolant = {};
  let accumulatedDistance = 0;
  let positionMap;
  // Quaterion
  let quaternionFlag;
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
    positionFlag = 0;
    quaternionFlag = 0;
    if (positionMap.has(clipName) === false && quaternionMap.has(clipName) === false) return;
    activeTrackName = clipName;
    startAnimationTime = deltaSeconds;
    accumulatedAnimationTime = 0;
    // If clip has world position tracks
    if (positionMap.has(clipName) === true) {
      const { times, values } = positionMap.get(clipName);
      clipTrackTimes = times;
      accumulatedDistance = 0;
      positionFlag = 1;
    }
    // If clip has world quaternion tracks
    if (quaternionMap.has(clipName) === true) {
      const { times, values } = quaternionMap.get(clipName);
      clipTrackTimes = times;
      startQuat.copy(worldMesh.quaternion);
      quaternionFlag = 1;
    }
  }


  const update = (deltaSeconds) => {
    if (positionFlag < 1 && quaternionFlag < 1) return;
    accumulatedAnimationTime += deltaSeconds;
    const timeOffset = accumulatedAnimationTime - startAnimationTime;
    for (let idx = 1, nTracks = clipTrackTimes.length; idx < nTracks; idx++) {
      if (clipTrackTimes[idx - 1] < timeOffset && clipTrackTimes[idx] > timeOffset) {
      if (positionFlag === 1) {
        const [x, y, z] = vectorInterpolant[activeTrackName].interpolate_(idx, clipTrackTimes[idx - 1], timeOffset, clipTrackTimes[idx]);
        const increment = z - accumulatedDistance;
        accumulatedDistance += increment;
        const { x: xDirection, _ , z:zDirection } = getYAxisDirectionVector(yRadians);
        worldMesh.position.x += xDirection * increment;
        worldMesh.position.z += zDirection * increment * -1;
      }
      if (quaternionFlag === 1) {
        const [x, y, z, w] = quaternionInterpolant[activeTrackName].interpolate_(idx, clipTrackTimes[idx - 1], timeOffset, clipTrackTimes[idx]);
        interpolatedQuat.set(x, y, z, w);
        startPlusInterpolatedQuat.multiplyQuaternions(startQuat, interpolatedQuat);
        worldMesh.quaternion.copy(startPlusInterpolatedQuat);
        _setYRotation();
      }
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