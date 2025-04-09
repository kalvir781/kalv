---
layout: layouts/home.njk
title: vlog
templateClass: tmpl-post
eleventyNavigation:
  key: vlog
  order: 3
---

Vlog, I privately record myself for video notes all the time but struggle with space on iCloud or Google Photos. So I've made this app to make quick videos and then save them to my device or laptop for synchronizing any time I like.

<div id="vlog">
    <video id="preview" width="640" height="480" autoplay muted></video>
    <div>
        <button id="startButton" disabled>Start Recording</button>
        <button id="stopButton" disabled>Stop Recording</button>
    </div>
    <div id="status">Loading ffmpeg... Please wait.</div>
    <a id="downloadLink" download="output.mp4">Download Processed Video (MP4)</a>
</div>

<script src="https://unpkg.com/@ffmpeg/ffmpeg@0.11.0/dist/ffmpeg.min.js"></script>

This method of self talk has been great to keep a 'Captains Log' of my research and journaling my thoughts. Throughout doing these, I've found myself adding more thoughts and gaining more focus in my work.
