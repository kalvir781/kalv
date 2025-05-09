import Nort from './nort.js'
import ReadPost from './readPost.js'
import JustShare from './just-share.js'

/* ========= */
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
	recordedBlobs = [];
	actualMimeType = ''; // Reset actual mime type
	downloadLink.style.display = 'none';
	downloadLink.href = '#';
	preview.style.display = 'block';

	try {
		mediaStream = await navigator.mediaDevices.getUserMedia({
			video: { width: { ideal: 1280 }, height: { ideal: 720 } },
			audio: true
		});

		const videoTrack = mediaStream.getVideoTracks()[0];
		const settings = videoTrack.getSettings();
		console.log("Actual Video Track Settings:", settings); // Good for debugging

		preview.srcObject = mediaStream;
		preview.captureStream = preview.captureStream || preview.mozCaptureStream;

		// --- Get mimeType options ---
		const options = getSupportedMimeTypeOptions();

		// --- Instantiate MediaRecorder ---
		if (options) {
			// A specific mimeType was supported
			mediaRecorder = new MediaRecorder(mediaStream, options);
		} else {
			// No specific type supported, let the browser choose its default
			mediaRecorder = new MediaRecorder(mediaStream);
		}

		// --- Crucial: Get the *actual* mimeType being used ---
		actualMimeType = mediaRecorder.mimeType;
		if (!actualMimeType) {
			// Fallback if browser doesn't report mimeType immediately (rare)
			actualMimeType = options ? options.mimeType : 'video/mp4'; // Guess MP4 if default
			console.warn(`MediaRecorder.mimeType was empty, falling back to: ${actualMimeType}`);
		}
		console.log(`MediaRecorder active with mimeType: ${actualMimeType}`);

		mediaRecorder.ondataavailable = (event) => {
			if (event.data && event.data.size > 0) recordedBlobs.push(event.data);
		};
		mediaRecorder.onstop = handleStop; // handleStop will now use global 'actualMimeType'
		mediaRecorder.start();

		console.log('MediaRecorder started', mediaRecorder);
		status.textContent = 'Recording... (Audio & Video)';
		startButton.disabled = true;
		stopButton.disabled = false;

	} catch (err) {
		console.error("Error starting recording:", err);
		// Check specifically for OverconstrainedError which can happen if exact constraints fail
		if (err.name === 'OverconstrainedError') {
			status.textContent = `Error: Requested resolution/settings not supported by camera. (${err.message})`;
		} else {
			status.textContent = `Error starting recording: ${err.message}. Check permissions.`;
		}
		preview.style.display = 'none';
		if (mediaStream) cleanupStream();
		else preview.srcObject = null;
		startButton.disabled = false;
		stopButton.disabled = true;
		actualMimeType = ''; // Clear mime type on error
	}
}


function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    stopButton.disabled = true;
    status.textContent = 'Stopping recording, preparing for processing...';
    preview.style.display = 'none';
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
      '-vf', 'hflip,scale=trunc(iw*480/ih/2)*2:480',
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
// Variable to store the actual mimeType chosen by MediaRecorder
let actualMimeType = ''; // Use this in handleStop

function getSupportedMimeTypeOptions() {
	const typesToTest = [
		// Prioritize WebM with Opus if available (common elsewhere)
		{ mimeType: "video/webm;codecs=vp9,opus" },
		{ mimeType: "video/webm;codecs=vp8,opus" },
		// Check MP4 with common codecs
		{ mimeType: "video/mp4;codecs=h264,aac" },
		// Check generic container types (less specific)
		{ mimeType: "video/webm" },
		{ mimeType: "video/mp4" } // Generic MP4 - Might work on iOS
	];

	for (const typeInfo of typesToTest) {
		if (MediaRecorder.isTypeSupported(typeInfo.mimeType)) {
			console.log(`Found supported specific mimeType: ${typeInfo.mimeType}`);
			return typeInfo; // Return the whole object { mimeType: "..." }
		}
	}

	console.warn("No specific mimeType found. Will let browser choose default.");
	return null; // Indicate that no specific preference was supported
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

document.addEventListener("DOMContentLoaded", () => {
  const readPost = document.getElementById("read-post");
  if (readPost !== null) {
    new ReadPost();
  }

  const nort = document.getElementById("nort");
  if (nort !== null) {
    const app = new Nort('nort', '/models/bedroom.obj');
  }

  const justShare = document.getElementById("just-share");
  if (justShare !== null) {
    new JustShare();
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
