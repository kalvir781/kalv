import SamJs from 'sam-js';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = undefined;

class ThreeJsLoop {

  constructor(canvasId) {
    this.initAudio();

    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with ID "${canvasId}" not found.`);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    // Resizing the canvas if the window resizes - Not sure if I need this.
    this.animate = this.animate.bind(this); // Bind 'this' to animate function
    this.resize = this.resize.bind(this); // Bind 'this' to resize function
    window.addEventListener('resize', this.resize, false);
    this.resize(); // Initial resize

    this.setupScene();
    this.animate();
  }

  setupScene() {
    // Override this method to add objects to the scene
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshBasicMaterial({ color: "#03fcdf" });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black color
    this.line = new THREE.LineSegments(edges, lineMaterial);
    this.scene.add(this.line);

    this.camera.position.z = 5;
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  update() {
    const { bass, treble } = this.calculateBassTreble();

    // Override this method to update objects in the scene
    if (this.cube) {
      //this.cube.rotation.x += 0.01;
      //this.line.rotation.x += 0.01;
      this.cube.rotation.x = treble * 0.5
      this.line.rotation.x = treble * 0.5;

      //this.cube.rotation.y += 0.01;
      //this.line.rotation.y += 0.01;
      this.cube.rotation.y = bass * 0.05;
      this.line.rotation.y = bass * 0.05;

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

  async initAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      source.connect(this.analyser);
      /* Need to move to three.js animate or pulling the data from the dataArray to the x y down below */
      //visualize();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }

  getFrequencyData() {
    if (!this.analyser) return;
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  calculateBassTreble() {
    const data = this.getFrequencyData();
    if (!data) return { bass: 0, treble: 0 };

    let bassSum = 0;
    let trebleSum = 0;
    const bassEnd = Math.floor(data.length * 0.1); // Adjust for bass frequency range
    const trebleStart = Math.floor(data.length * 0.8); // Adjust for treble frequency range

    for (let i = 0; i < bassEnd; i++) {
      bassSum += data[i];
    }

    for (let i = trebleStart; i < data.length; i++) {
      trebleSum += data[i];
    }

    const bass = bassSum / bassEnd;
    const treble = trebleSum / (data.length - trebleStart);
    return { bass, treble };
  }
}

class ObjLoaderApp {
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
class DrawingApp {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.canvas.addEventListener("pointerdown", this.startDrawing.bind(this));
		this.canvas.addEventListener("pointerup", this.stopDrawing.bind(this));

		this.saveLink = document.getElementById("board-save-link")
		this.saveLink.addEventListener("click", this.handleSave.bind(this));

		this.previousPosition = {
			x: 0, y: 0
		};
		this.draw = this.draw.bind(this);
	}

	draw(event) {
		const position = { x: event.offsetX, y: event.offsetY};
		this.drawLine(
			this.previousPosition,
			position
		);
		this.previousPosition = position;
	}

	startDrawing(event) {
		this.canvas.addEventListener("pointermove", this.draw);
		this.canvas.setPointerCapture(event.pointerId);
		this.previousPosition = {
			x: event.offsetX,
			y: event.offsetY
		}
	}

	stopDrawing() {
		this.canvas.removeEventListener("pointermove", this.draw);
		this.canvas.releasePointerCapture(event.pointerId);
	}

	drawLine(from, to) {
		this.context.beginPath();
		this.context.strokeStyle = "blue";
		this.context.moveTo(from.x, from.y);
		this.context.lineTo(to.x, to.y);
		this.context.stroke();
		this.context.closePath();
	}

	handleSave() {
		const image = this.canvas.toDataURL("image/webp");	
		this.saveLink.href = image;
	}
}

class T2V{
  constructor(box) {
    this.inputElement = box;
    this.myString = '';
    this.timeoutId = null;

    this.inputElement.addEventListener('input', (event) => {
      const newValue = event.target.value;

    //  // Clear any existing timeout
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {

        this.myString = newValue;

        new SamJs(
          //{speed: 72, pitch: 64, throat: 110, mouth: 160} 
{speed: 94, pitch: 37, throat: 191, mouth: 193}
        ).speak(this.myString);

        console.log('Speaking: ', this.myString);
      }, 1000);
    });
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Mars Clock */
class Clock {
	constructor(clock) {
		this.clock = clock;
    //this.currentPst = document.getElementById("current-pst-time");
    this.currentInterval = 1;
    this.lastMarker = " - o";
    this.previousMarker = "";
    setInterval(this.startCurrentPst.bind(this), 1000);

    setTimeout(this.start.bind(this), this.currentInterval * 1000);
  }

  startCurrentPst() {
    //this.currentPst.innerHTML = new Date().toLocaleString('en', {timeZone: 'America/Vancouver'});
  }

  start() {
    // render
    this.clock.innerHTML = "⧊⧋◬ " +this.currentInterval + "::" + this.lastMarker + "::" + this.previousMarker;

    // work out next mars interval
    this.previousMarker = this.lastMarker;
    this.lastMarker = this.currentInterval;
    this.currentInterval = getRandomInt(1,60);

    // fire next sun mars ping
    setTimeout(this.start.bind(this), this.currentInterval * 1000);

  }
}

/* Built by Kalv */
document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("drawing-app");
	if (canvas !== null) {
		new DrawingApp(canvas);
	}

  const box = document.getElementById("t2v");
  if (box !== null) {
    new T2V(box);
  }

  const clock = document.getElementById("clock");
  if (clock !== null) {
    new Clock(clock);
  }

  const visualizer = document.getElementById("visualizer");
  if (visualizer !== null) {
    const myLoop = new ThreeJsLoop('visualizer');

  }
  const nort = document.getElementById("nort");
  if (nort !== null) {
    const app = new ObjLoaderApp('nort', '/models/bedroom.obj');
  }
});
