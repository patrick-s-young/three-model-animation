

export const ScriptPlayer = ({
  animationMixer,
  scripts 
}) => {
  let scriptState = {};
  let rotateFlag = 0;

  animationMixer.setAnimationMixerFinishedCallback(clipActionFinished)
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
    const { clipIdx, clipNames } = scriptState;
    const { clipName } = clipNames[clipIdx];
    animationMixer.playClipAction(clipName); 
  }

  function clipActionFinished (ev) {
    const { clipIdx, clipNames, scriptLength } = scriptState;
    const { clipName, loop, rotate } = clipNames[clipIdx];
    rotateFlag = rotate;
    scriptState.clipIdx = (clipIdx + 1) % scriptLength;
    playNextClipActionInScript();
  }

  const resetRotateFlag = () => rotateFlag = 0;

  return {
    get rotateFlag() { return rotateFlag },
    startNewScript,
    resetRotateFlag
  }
}