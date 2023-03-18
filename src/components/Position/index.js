

export const Position = ({ mesh }) => {
  let timeline;
  let accumulatedDistance
  let idx = 0;
  let idxLimit;
  let startAnimationTime;
  let times;
  let values;
  

// INITIALIZE TRACKS
  const setTrack = (track) => {
    console.log('setTrack', track)
    times = track.times;
    values = track.values;
    startAnimationTime = Date.now();
    idxLimit = times.length - 1;
    accumulatedDistance = 0;
  }

// TODO - cache timeDiff
  const update = ({ yRotation }) => {
    console.log('position.update')
    const timeOffset = (Date.now() - startAnimationTime) * 0.001;
    console.log('timeOffset', timeOffset)
    for (idx = 0; idx < idxLimit; idx++) {
      if (times[idx] < timeOffset && times[idx + 1] > timeOffset) {
        const minTime = times[idx];
        const maxTime = times[idx + 1];
        const minValue = values[idx * 3 + 2] * 0.1;
        const maxValue = values[(idx + 1) * 3 + 2] * 0.1;
       // const { time: minTime, value: minValue } = timeline[idx];
       // const { time: maxTime, value: maxValue } = timeline[idx + 1];
        const valueDiff = maxValue - minValue;
        const timeDiff = maxTime - minTime;
        const timeInterpolation = (timeOffset - minTime) / timeDiff;
        const valueInterpolation = minValue + timeInterpolation * valueDiff;
        const increment = valueInterpolation - accumulatedDistance;
        accumulatedDistance += increment;

        const xDirection = Math.sin(-yRotation);
        const zDirection = Math.cos(yRotation);
        mesh.position.x += xDirection * increment;
        mesh.position.z += zDirection * increment * -1;
        break;
      }
    }

  }


  return {
    update,
    setTrack
  }
}