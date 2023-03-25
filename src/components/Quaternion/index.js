import * as THREE from 'three';

export const Quaternion = ({ mesh }) => {
  let activeTrackName;
  let startAnimationTime;
  let times;
  let quaternionMap;
  let yRadians = 0;
  const quaternionInterpolant = {};
  const startQuat = new THREE.Quaternion();
  const interpolatedQuat = new THREE.Quaternion();
  const startPlusInterpolatedQuat = new THREE.Quaternion();

// INIT ALL QUATERNION TRACKS
  const initTracks = (_quaternionMap) => {
    quaternionMap = _quaternionMap;
    for (let [key, tracks] of quaternionMap.entries()) {
      const { times, values } = tracks;
       const quaternionKeyframeTrack = new THREE.QuaternionKeyframeTrack(key, times, values);
       quaternionInterpolant[key] = quaternionKeyframeTrack.InterpolantFactoryMethodLinear();
    }
  }

//PLAY TRACK
  const playTrack = (trackName) => {
    if (quaternionMap.has(trackName) === false) return;
    activeTrackName = trackName;
    const track = quaternionMap.get(trackName);
    times = track.times;
    startAnimationTime = Date.now();
    startQuat.copy(mesh.quaternion);
  }


// UPDATE ACTIVE TRACK
const update = () => {
  const timeOffset = (Date.now() - startAnimationTime) * 0.001;
  for (let idx = 1; idx < times.length - 1; idx++) {
    if (times[idx - 1] < timeOffset && times[idx] > timeOffset) {
      const [x, y, z, w] = quaternionInterpolant[activeTrackName].interpolate_(idx, times[idx - 1], timeOffset, times[idx]);
      interpolatedQuat.set(x, y, z, w);
      startPlusInterpolatedQuat.multiplyQuaternions(startQuat, interpolatedQuat);
      mesh.quaternion.copy(startPlusInterpolatedQuat);
      setYRotation();
      break;
    }
  }
}

  const setYRotation = () => {
    const [x, yNow, z, w] = mesh.quaternion.toArray();
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
    playTrack,
    initTracks,
    get yRadians() { return yRadians }
  }
}

