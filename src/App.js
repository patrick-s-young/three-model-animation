// Three
import * as THREE from 'three';
// Scene
import { Scene } from './scene/Scene';
import { Camera } from './cameras/Camera';
import { Lights } from './lights/Lights';
// GLTF
import { AnimatedModel } from './models/AnimatedModel';
// Mesh
import { Floor } from './models/Floor';
// Renderer
import { Renderer } from './renderer/Renderer';
// Character & Animation configs
import { CONFIGS } from './configs/configs';
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
  const cat = AnimatedModel(CONFIGS.CHARACTER, CONFIGS.ANIMATION, onAnimatedModelInit);
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



  function onAnimatedModelInit() {
    renderer.setAnimationLoop(animationLoopCallback);
  }

  // RENDER LOOP
  function animationLoopCallback(timestamp) {
    const dt = clock.getDelta();
    cat.update(dt);
    renderer.render(scene.self, camera.self);
  }

  return null;
}


