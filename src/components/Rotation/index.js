
import * as THREE from 'three';

export const Rotation = ({ mesh, defaultRotation }) => {
  let yRotation = defaultRotation;
  
  const yRotateAngle = new THREE.Vector3(0, 1, 0);
  const yRotateQuaternion = new THREE.Quaternion();
  rotateY(yRotation);
  


  function rotateY(radians) {
    yRotation = yRotation + radians;
    yRotateQuaternion.setFromAxisAngle(yRotateAngle, yRotation);
    mesh.quaternion.copy(yRotateQuaternion);
  }

  return {
    set y(radians) { rotateY(radians) },
    get y() { return yRotation }
  }
}