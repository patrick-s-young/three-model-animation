

export const ScriptPlayer = ({
  animationMixer,
  configs: { scripts, defaultScript }, 
}) => {
  let scriptState = {};
  let rotateFlag = 0;
  let translateFlag = 0;
  let loopTranslateState = 0; // 1 - start, 2 - active, - 0 inactive
  let mps = 0;
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
    loopTranslateState = 0;
    mps = 0;
    timelineFlag = 0;
    timeline = undefined

    const { clipIdx, clipNames } = scriptState;
    const { clipName, metersPerSecond, timeline: newTimeline } = clipNames[clipIdx];
    if (metersPerSecond !== undefined) {
      loopTranslateState = 1;
      mps = metersPerSecond;
    } 
    if (newTimeline !== undefined) {
      timeline = newTimeline;
      timelineFlag = 1;
    }
    animationMixer.playClipAction(clipName); 
  }

  function clipActionFinished (ev) {
    const { clipIdx, clipNames, scriptLength } = scriptState;
    const { rotate, translate } = clipNames[clipIdx];
    rotateFlag = rotate ?? 0;
    translateFlag = translate ?? 0;
    scriptState.clipIdx = (clipIdx + 1) % scriptLength;
    playNextClipActionInScript();
  }

  const resetRotateFlag = () => rotateFlag = 0;
  const resetTranslateFlag = () => translateFlag = 0;
  const resetTimelineFlag = () => timelineFlag = 0;

  const startTimeline = () => {
    timelineFlag = 2;
  }

  return {
    get rotateFlag() { return rotateFlag },
    get translateFlag() { return translateFlag },
    get timelineFlag() { return timelineFlag },
    startTimeline,
    get updateLoop() { return loopTranslateState === 2},
    get mps() { return mps },
    get timeline() { return timeline },
    resetRotateFlag,
    resetTranslateFlag,
    resetTimelineFlag
  }
}