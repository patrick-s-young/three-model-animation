// Three
import * as THREE from 'three';
// Scene
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
// GLTF
import { Character } from './components/Character';
// Mesh
import { Floor } from './components/Floor';
// Renderer
import { Renderer } from './components/Renderer';
// Character & Animation configs
import { CONFIGS } from './configs';
// Helpers
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Styles
import './style.css';


//////////////////
// BEGIN COMPONENT
export const App = () => {
  // SCENE SETUP
  const scene = Scene();
  const camera = Camera();
  const lights = Lights();
  scene.add(lights.getLights());
  // GLTF
  const cat = Character(CONFIGS.CHARACTER, CONFIGS.ANIMATION, onCharacterInit);
  scene.add(cat.mesh);
  // MESH
  const floor = Floor();
  scene.add(floor.mesh);
  // RENDERER
  const renderer = Renderer();
  document.body.appendChild(renderer.domElement);
  const clock = new THREE.Clock();
  // ORBIT CONTROLS
  const controls = new OrbitControls(camera.self, renderer.domElement)
  controls.target.set(0, 0, 0);
  controls.update();

  renderer.setAnimationLoop(animationLoopCallback);

  function onCharacterInit() {
    console.log('character initialized');
  }

  // RENDER LOOP
  function animationLoopCallback(timestamp) {
    const dt = clock.getDelta();
    cat.update(dt);
    renderer.render(scene.self, camera.self);
  }

  return null;
}


