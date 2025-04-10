---
layout: layouts/home.njk
title: Text To Speech
templateClass: tmpl-post
eleventyNavigation:
  key: Text To Speech
  order: 3
---

<div id="t2v">
<form id="t2v-form">
    <textarea id="t2v-text-to-speak">Hello my name is Kalv. This is a little tool to help those that can't talk!</textarea>
    <input type="submit" value="Speak" class="submit-btn">
</form>

A tool that will allow young children to communicate easily when they struggle with the ability to talk.

<small>
Has been tested on Mac OS (Safari, Chrome), not sure about windows or chromebooks. Using the wonderful web native speech API, 
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
</small>

</div>
