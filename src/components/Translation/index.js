

export const Translation = ({ mesh }) => {
  let timeline;
  let accumulatedDistance
  let idx = 0;
  let idxLimit;
  let startAnimationTime;
  

// INITIALIZE TRACKS
  const setTimeline = (newTimeline) => {
    startAnimationTime = Date.now();
    timeline = newTimeline;
    idxLimit = timeline.length - 1;
    accumulatedDistance = 0;
  }

// TODO - cache timeDiff
  const update = ({ yRotation }) => {
    const timeOffset = Date.now() - startAnimationTime;
    for (idx = 0; idx < idxLimit; idx++) {
      if (timeline[idx].time < timeOffset && timeline[idx + 1].time > timeOffset) {
        const { time: minTime, value: minValue } = timeline[idx];
        const { time: maxTime, value: maxValue } = timeline[idx + 1];
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
    setTimeline
  }
}