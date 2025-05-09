---
layout: layouts/home.njk
title: Just Share
templateClass: tmpl-post
eleventyNavigation:
  key: Just Share
  order: 3
---

Just share. A tool to upload a file and share it to another. All without a server upload. As long as your tab is open you are sharing the file.

Simply share the Magnet URI url with another user and this link 'https://kalv.co.uk/just-share' and they can enter the Magnet URI and download it.

<div id="just-share">
	<h2>Seed Data</h2>
	<label for="fileInput">Select a file to share:</label>
	<input type="file" id="fileInput"><br>
	<button id="seedButton" disabled>Seed File</button>
	<div id="seedingInfo"></div>
	
	<!-- get it working one page for now, the introduce the URL generation by appending something the URI pushHistory and have a copy button to copy the link -->
	<!-- or have the JS populate the 'text' element below -->
	
	<h2>Download Data</h2>
	<label for="magnetInput">Enter Magnet URI or Info Hash:</label>
	<input type="text" id="magnetInput" size="50"><br>
	<button id="downloadButton">Download</button>
	<div id="downloadInfo"></div>
	<div id="downloadedContent"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"></script>

<small>
Description
</small>
