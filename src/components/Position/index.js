// TODO - import meshScaler from configs
const meshScaler = 0.1;

export const Position = ({ mesh }) => {
  let activeTrackName;
  let startAnimationTime;
  let accumulatedDistance;
  let times;
  let values;
  let positionMap;
  const trackIntervals = {};
  const rotationCache = {};


// INIT ALL POSITION TRACKS
  const initTracks = (_positionMap) => {
    positionMap = _positionMap;
    // Precompute intervals between track key frames
    for (let [key, tracks] of positionMap.entries()) {
      const { times, values } = tracks;
      const timeIntervals = [];
      const valueIntervals = [];
      for (let idx = 0; idx < times.length - 1; idx++) {
        timeIntervals.push(times[idx + 1] - times[idx]);
        // Working with just Z position for now
        const minValue = values[idx * 3 + 2] * meshScaler;
        const maxValue = values[(idx + 1) * 3 + 2] * meshScaler;
        valueIntervals.push(maxValue - minValue);
      }
      trackIntervals[key] = {
        time: timeIntervals,
        value: valueIntervals
      }
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
  const playTrack = (trackName) => {
    if (positionMap.has(trackName) === false) return;
    activeTrackName = trackName;
    const track = positionMap.get(trackName);
    times = track.times;
    values = track.values;
    startAnimationTime = Date.now();
    accumulatedDistance = 0;
  }

// UPDATE ACTIVE TRACK
  const update = ({ yRotation }) => {
    const timeOffset = (Date.now() - startAnimationTime) * 0.001;
    for (let idx = 0; idx < times.length - 1; idx++) {
      if (times[idx] < timeOffset && times[idx + 1] > timeOffset) {
        const minTime = times[idx];
        const minValue = values[idx * 3 + 2] * meshScaler;
        const timeDiff = trackIntervals[activeTrackName].time[idx];
        const valueDiff = trackIntervals[activeTrackName].value[idx];
        const timeInterpolation = (timeOffset - minTime) / timeDiff;
        const valueInterpolation = minValue + timeInterpolation * valueDiff;
        const increment = valueInterpolation - accumulatedDistance;
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