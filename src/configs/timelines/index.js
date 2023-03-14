import { walk_loop_treadmill_timeline } from './walk_loop_treadmill';
import { walk_to_stand_treadmill } from './walk_to_stand_treadmill';
import { stand_to_walk_treadmill } from './stand_to_walk_treadmill';
const meshScaler = 0.1;


export const timelines = {
  stand_to_walk_treadmill: (() => formatTimeline(stand_to_walk_treadmill) )(),
  walk_loop_treadmill: (() => formatTimeline(walk_loop_treadmill_timeline) )(),
  walk_to_stand_treadmill: (() => formatTimeline(walk_to_stand_treadmill) )()
}

function formatTimeline (timelineObj) {
  const times = Object.values(timelineObj.times);
  const values = Object.values(timelineObj.values);
  const timeline = [];
  for (let idx = 0; idx < times.length; idx++) {
    const time = times[idx] * 1000;
    const value = values[idx * 3 + 2] * meshScaler;
    timeline.push({ time, value });
  }
  return timeline;
}
