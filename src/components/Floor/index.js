import * as THREE from 'three';

export function Floor() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/textures/checkerboard.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = texture.repeat.y = 40;

  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  const geometry = new THREE.PlaneGeometry(100, 100);
  const mesh = new THREE.Mesh( geometry, material );
  mesh.rotateX(-Math.PI / 2)

return {
  get mesh() { return mesh }
}
}