import * as THREE from 'three';

class ThreeJsLoop {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with ID "${canvasId}" not found.`);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.animate = this.animate.bind(this); // Bind 'this' to animate function
    this.resize = this.resize.bind(this); // Bind 'this' to resize function

    window.addEventListener('resize', this.resize, false);
    this.resize(); // Initial resize

    this.setupScene();
    this.animate();
  }

  setupScene() {
    // Override this method to add objects to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    // Override this method to update objects in the scene
    if (this.cube) {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
    }
  }

  resize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  // Example method to add an object after instantiation.
  addObject(object){
    this.scene.add(object);
  }

  //Example method to remove an object after instantiation.
  removeObject(object){
    this.scene.remove(object);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const visualizer = document.getElementById("visualizer");
  if (visualizer !== null) {
    const myLoop = new ThreeJsLoop('visualizer');

    //Example of adding and removing objects after the loop has started.
    const geometry2 = new THREE.SphereGeometry( 0.5, 32, 16 );
    const material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry2, material2 );
    sphere.position.x = 2;
    myLoop.addObject(sphere);

    // After 5 secs remove the sphere.
    setTimeout(()=>{
      myLoop.removeObject(sphere);
    }, 5000)
  }
});
