---
layout: layouts/home.njk
title: vlog
templateClass: tmpl-post
eleventyNavigation:
  key: vlog
  order: 3
---

480p MP4 recorder. Easily record videos to save locally right from the browser.
NOTE: Works better on desktop and smaller videos. iOS is a little janky and haven't tested on mobile chrome.

<div id="vlog">
    <div>
        <button id="startButton" disabled>Start Recording</button>
        <button id="stopButton" disabled>Stop Recording</button>
    </div>
    <video id="preview" width="640" height="480" autoplay muted></video>
    <div id="status">Loading ffmpeg... Please wait.</div>
    <a id="downloadLink" download="output.mp4">Download Processed Video (MP4)</a>
</div>

<script src="https://unpkg.com/@ffmpeg/ffmpeg@0.11.0/dist/ffmpeg.min.js"></script>

I privately record myself for video notes all the time but struggle with space on iCloud or Google Photos. I've made this app to make them quickly and then save them to my device or laptop where I like. Either privately, on Google Drive or iCloud.

This method of self talk has been great to keep a 'Captains Log' of my research and journaling my thoughts. Throughout doing these, I've found myself adding more thoughts and gaining more focus on my work.
