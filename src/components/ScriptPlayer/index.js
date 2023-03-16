

export const ScriptPlayer = ({
  animationMixer,
  configs: { scripts, defaultScript }, 
}) => {
  let scriptState = {};
  let rotateFlag = 0;
  let timelineFlag = 0; // 1: start, 2: active, 0: inactive
  let timeline;

  animationMixer.setAnimationMixerFinishedCallback(clipActionFinished);
  startNewScript(defaultScript);


  // START NEW SCRIPT
  function startNewScript (scriptName) {
    scriptState = {
      scriptName,
      clipNames: scripts[scriptName],
      scriptLength: scripts[scriptName].length,
      clipIdx: 0
    };
    playNextClipActionInScript();
  }

  function playNextClipActionInScript () {
    if (scriptState.scriptName === undefined) { console.log('scriptState.scriptName === undefined'); return; }
    timelineFlag = 0;
    timeline = undefined

    const { clipIdx, clipNames } = scriptState;
    const { clipName, timeline: newTimeline } = clipNames[clipIdx];
    if (newTimeline !== undefined) {
      timeline = newTimeline;
      timelineFlag = 1;
    }
    animationMixer.playClipAction(clipName); 
  }

  function clipActionFinished (ev) {
    const { clipIdx, clipNames, scriptLength } = scriptState;
    const { rotate } = clipNames[clipIdx];
    rotateFlag = rotate ?? 0;
    scriptState.clipIdx = (clipIdx + 1) % scriptLength;
    playNextClipActionInScript();
  }

  return {
    get rotateFlag() { return rotateFlag },
    get timelineFlag() { return timelineFlag },
    get timeline() { return timeline },
    startTimeline: () => timelineFlag = 2,
    resetRotateFlag: () => rotateFlag = 0,
    resetTimelineFlag: () => timelineFlag = 0
  }
}