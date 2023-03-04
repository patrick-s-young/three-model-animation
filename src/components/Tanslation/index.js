

export const Translation = ({ mesh, defaultPosition }) => {
  let xPos;
  let yPos;
  let zPos;

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

  return {
    setPosition,
    setXZPosition
  }
}