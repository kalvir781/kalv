import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Nort {
  constructor(containerId, objFilePath) {
    this.container = document.getElementById(containerId);
    this.objFilePath = objFilePath;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.loadedObject = null; // Store the loaded object
    this.init();
    this.infoDiv = document.getElementById('info');
    console.log("NORT initialized");
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.loadObj();
    this.animate();
    this.setupEventListeners();
  }

  loadObj() {
    const loader = new OBJLoader();
    loader.load(
      this.objFilePath,
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x808080 });
          }
        });
        this.scene.add(object);
        this.loadedObject = object; // Store the object
        console.log("loaded up the object");
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('An error happened: ' + error);
      }
    );
  }

  animate() {
    const animateFunction = () => {
      requestAnimationFrame(animateFunction);

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
    };
    animateFunction();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}

export default Nort;
