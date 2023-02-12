import * as THREE from 'three';

export function Camera() {
  const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
  camera.position.set( 0, 4, 4 );

  return {
    get self() { return camera },
    get quaternion() { return camera.quaternion }
  }
}