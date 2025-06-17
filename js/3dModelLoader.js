import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';


let scene, camera, renderer, mixer, clock;

export function init3DModel() {
  const container = document.getElementById("lion-3d-container");
  if (!container) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));
  clock = new THREE.Clock();

  const loader = new GLTFLoader();
  loader.load('models/lion.gltf', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
      action.paused = true;
    });

    function animate() {
      requestAnimationFrame(animate);
      mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    }

    animate();
  });
}

export function playLionAnimation() {
  if (mixer) {
    mixer._actions.forEach(action => action.paused = false);
  }
}
