import * as THREE from 'three';

export function Renderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  return {
    setAnimationLoop: renderer.setAnimationLoop,
    render: (scene, camera) => renderer.render(scene, camera),
    get domElement() { return renderer.domElement },
    get self() { return renderer }
  }
}