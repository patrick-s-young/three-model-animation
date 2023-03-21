
export const ScriptPlayer = ({
  animation,
  configs: { scripts, defaultScript },
}) => {
  let scriptState = {};
  let rotateFlag = 0;
 
  // create positionMap
  animation.setAnimationMixerFinishedCallback(clipActionFinished);
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
    const { clipIdx, clipNames } = scriptState;
    const { clipName } = clipNames[clipIdx];
    animation.playClipAction(clipName); 
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
    resetRotateFlag: () => rotateFlag = 0
  }
}