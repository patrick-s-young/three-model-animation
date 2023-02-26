

export const Translation = ({ mesh, defaultPosition }) => {
  setPosition(...defaultPosition);

  function setPosition(x, y, z){
    mesh.position.set(x, y, z);
  }

  // function moveToPosition

  return {
    setPosition: (x, y, z) => setPosition(x, y, z),
    // set moveToPosition
    // get moveToPosition
  }
}