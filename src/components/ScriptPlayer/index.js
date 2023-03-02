

export const ScriptPlayer = ({
  animationMixer,
  configs: { scripts, defaultScript }, 
}) => {
  let scriptState = {};
  let rotateFlag = 0;
  let translateFlag = 0;

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
    const { clipIdx, clipNames } = scriptState;
    const { clipName } = clipNames[clipIdx];
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

  return {
    get rotateFlag() { return rotateFlag },
    get translateFlag() { return translateFlag },
    startNewScript,
    resetRotateFlag,
    resetTranslateFlag
  }
}