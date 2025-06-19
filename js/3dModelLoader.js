let scene, camera, renderer, mixer, clock;

export function init3DModel() {

   const container = document.getElementById("lion-3d-container");
  if (!container || container.children.length > 0) return;


  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 3, 0); 


  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));
  clock = new THREE.Clock();

  const loader = new GLTFLoader();
  loader.load('models/lion.gltf', (gltf) => {
    const model = gltf.scene;
    
    model.scale.set(0.25, 0.25, 0.25);

     model.rotation.y = -Math.PI / 4;
     model.position.y = 1.5;
    
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
      action.paused = true;
    });

    animate();
  }, undefined, (error) => {

    console.error('Error loading 3D model:', error);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  }
}

export function playLionAnimation() {
  if (mixer) {
     mixer.stopAllAction();
    mixer._actions.forEach(action => {
      action.reset();
       action.play();   
      action.paused = false;
    });
  }
}export function stopLionAnimation() {
  if (mixer) {
    mixer._actions.forEach(action => {
      action.paused = true;
    });
  }
}

