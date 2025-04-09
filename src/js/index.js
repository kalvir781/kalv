import SamJs from 'sam-js';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = undefined;

/* Vlog util */

let preview = null;
let startButton = null;
let stopButton = null;
let status = null;
let downloadLink = null;

let ffmpeg;
let mediaRecorder;
let recordedBlobs = [];
let mediaStream;
let ffmpegWorking = false;

// --- Initialization ---

async function loadFFmpeg() {
    status.textContent = 'Loading ffmpeg-core.js...';
    try {
        ffmpeg = FFmpeg.createFFmpeg({
            log: true, // Enable logging for debugging
            corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
            // Use the same version core as the main library
        });
        await ffmpeg.load();
        status.textContent = 'FFmpeg loaded. Ready to record.';
        startButton.disabled = false;
    } catch (error) {
        console.error("Error loading ffmpeg:", error);
        status.textContent = 'Error loading FFmpeg. Check console and COOP/COEP headers.';
        alert('Failed to load FFmpeg. Ensure your server sends COOP/COEP headers and you are using HTTPS or localhost.');
    }
}

// --- Webcam and Recording Logic ---

async function startRecording() {
    if (ffmpegWorking) {
        status.textContent = 'FFmpeg is currently processing. Please wait.';
        return;
    }
    recordedBlobs = []; // Clear previous recording
    downloadLink.style.display = 'none'; // Hide old link
    downloadLink.href = '#'; // Reset href

    try {
        // Get webcam stream (video only for this example)
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 854 }, // Request HD if possible
                height: { ideal: 480 }
            },
            audio: true// Set to true if you want audio
        });

        preview.srcObject = mediaStream;
        preview.captureStream = preview.captureStream || preview.mozCaptureStream; // For Firefox compatibility

        // Detect supported mime type
        const options = getSupportedMimeTypeOptions();
        if (!options) {
            throw new Error("No supported MIME type found for MediaRecorder");
        }
        console.log('Using mimeType:', options.mimeType);

        mediaRecorder = new MediaRecorder(mediaStream, options);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
                // console.log(`Received data chunk: ${event.data.size} bytes`);
            }
        };

        mediaRecorder.onstop = handleStop; // Process video when recording stops

        mediaRecorder.start(); // Start recording continuously
        // Optionally provide timeslice: mediaRecorder.start(1000); // Collect chunks every second

        console.log('MediaRecorder started', mediaRecorder);
        status.textContent = 'Recording...';
        startButton.disabled = true;
        stopButton.disabled = false;

    } catch (err) {
        console.error("Error starting recording:", err);
        status.textContent = `Error starting recording: ${err.message}. Check permissions.`;
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop()); // Clean up tracks
        }
        preview.srcObject = null;
        startButton.disabled = false; // Allow retry if ffmpeg is loaded
        stopButton.disabled = true;
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        stopButton.disabled = true;
        status.textContent = 'Stopping recording, preparing for processing...';
        // Processing starts in the onstop handler
    }
}

async function handleStop() {
    console.log('Recorder stopped. Blobs recorded:', recordedBlobs.length);
    if (recordedBlobs.length === 0) {
        status.textContent = 'No data recorded.';
        startButton.disabled = false; // Re-enable start
        cleanupStream();
        return;
    }

    status.textContent = 'Processing video with ffmpeg... Please wait.';
    ffmpegWorking = true;
    startButton.disabled = true; // Disable start during processing
    stopButton.disabled = true; // Keep stop disabled

    try {
        // 1. Combine Blobs
        // Determine the mimeType used by the recorder
        const mimeType = mediaRecorder.mimeType || 'video/webm'; // Fallback guess
        const superBlob = new Blob(recordedBlobs, { type: mimeType });

        // Extract file extension (heuristic)
        let inputFilename = 'input.webm'; // Default guess
        if (mimeType.includes('mp4')) inputFilename = 'input.mp4';
        else if (mimeType.includes('quicktime')) inputFilename = 'input.mov';

        // 2. Write Blob to ffmpeg's virtual file system
        const inputData = await FFmpeg.fetchFile(superBlob);
        ffmpeg.FS('writeFile', inputFilename, inputData);
        console.log(`Wrote ${inputFilename} to ffmpeg FS (${inputData.length} bytes)`);

        // 3. Run ffmpeg command
        // -i input.webm : Input file
        // -vf "scale=-1:720": Scale video height to 720p, maintain aspect ratio
        // -c:v libx264: Encode video using H.264 codec (good for MP4)
        // -preset ultrafast: Faster encoding, lower quality/compression. Good for browser.
        // -crf 23: Constant Rate Factor (quality, lower=better, 18-28 is common)
        // -an: No audio (remove if you recorded audio and want it)
        // output.mp4: Output filename
        const ffmpegCommand = [
            '-i', inputFilename,
            '-vf', 'hflip,scale=-1:480',
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            //'-crf', '23',
            '-b:v', '2000k', 
            '-c:a', 'aac',
            '-b:a', '128k',
            'output.mp4'
        ];
        console.log('Running ffmpeg command:', ffmpegCommand.join(' '));
        await ffmpeg.run(...ffmpegCommand);
        console.log('FFmpeg processing finished.');

        // 4. Read the processed file
        const outputData = ffmpeg.FS('readFile', 'output.mp4');
        console.log(`Read output.mp4 from ffmpeg FS (${outputData.length} bytes)`);

        // 5. Create Download Link
        const outputBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
        const url = URL.createObjectURL(outputBlob);
        downloadLink.href = url;
        downloadLink.style.display = 'block'; // Show download link
        status.textContent = 'Processing complete. Video ready for download!';

        // 6. Cleanup ffmpeg FS
        ffmpeg.FS('unlink', inputFilename);
        ffmpeg.FS('unlink', 'output.mp4');

    } catch (error) {
        console.error('Error during ffmpeg processing:', error);
        status.textContent = `Error processing video: ${error.message || error}`;
    } finally {
        ffmpegWorking = false;
        cleanupStream(); // Stop webcam tracks
        startButton.disabled = false; // Re-enable start button
        stopButton.disabled = true; // Keep stop disabled until next recording
    }
}

// --- Utility Functions ---

function getSupportedMimeTypeOptions() {
    const types = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=h264,opus",
        "video/mp4;codecs=h264,aac", // Often less supported for recording directly
        "video/webm",
    ];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return { mimeType: type };
        }
    }
    console.warn("No specifically preferred mimeType supported, letting browser choose.");
    // Let browser choose default if none specifically supported
    if (MediaRecorder.isTypeSupported("video/webm")) {
         return { mimeType: "video/webm" }; // Common default
    }
    return undefined; // Indicate no support found or browser default needed implicitly
}


function cleanupStream() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
        preview.srcObject = null; // Clear preview
        console.log('MediaStream tracks stopped.');
    }
}
/* ========= */

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
    this.clock.innerHTML = "⧋◬ " +this.currentInterval + "::" + this.lastMarker + "::" + this.previousMarker;

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

  const vlog = document.getElementById("vlog");
  if (vlog !== null) {
    console.log("starting up vlog");
    // --- Load ---
    //window.addEventListener('load', loadFFmpeg); 
    preview = document.getElementById('preview');
    startButton = document.getElementById('startButton');
    stopButton = document.getElementById('stopButton');
    status = document.getElementById('status');
    downloadLink = document.getElementById('downloadLink');

    loadFFmpeg();



    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
  }

});
