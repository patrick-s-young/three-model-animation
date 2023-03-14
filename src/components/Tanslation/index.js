

export const Translation = ({ mesh, defaultPosition }) => {
  let xPos;
  let yPos;
  let zPos;
  let mps = 0;
  let prevMsec;

  setPosition(...defaultPosition);

  function setPosition(x, y, z){
    xPos = x;
    yPos = y;
    zPos = z;
    mesh.position.set(x, y, z);
  }

  const setXZPosition = ({ distance, yRotation }) => {
    const xDirection= Math.sin(-yRotation);
    const zDirection = Math.cos(yRotation);
    mesh.position.x += xDirection * distance;
    mesh.position.z += zDirection * distance * -1;
  }

  const setLoop = (metersPerSecond) => {
    mps = metersPerSecond;
    prevMsec = Date.now();
  }


  const updateLoop = ({ yRotation }) => {
    const elapsedMsec = Date.now() - prevMsec;
    const xDirection = Math.sin(-yRotation);
    const zDirection = Math.cos(yRotation);
    prevMsec += elapsedMsec;
    mesh.position.x += xDirection * elapsedMsec / 1000 * mps;
    mesh.position.z += zDirection * elapsedMsec / 1000 * mps * -1;
  }


  return {
    setPosition,
    setXZPosition,
    setLoop,
    updateLoop,
    get active() { return mps !== 0 }
  }
}