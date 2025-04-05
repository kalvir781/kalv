---
layout: layouts/home.njk
title: Text To Speech
templateClass: tmpl-post
eleventyNavigation:
  key: Text To Speech
  order: 3
---

<input id="t2v" value="" placeholder="SOMETHING TO SAY"></input>

I wanted to make a tool that will help young children communicate easily when they struggle with the ability to talk or are scared with the voices in their head challenging them on how to deal with the adults around them. 

This would be great to have on BBC news articles also, as it's lightweight and something that could help anyone read the news.

So I constructed this, you simply type and it will say the text.

Only works in the browser for now, some mobile browsers work (updated on Nov 8th 2024).

<small>
This is running all in the browser in under 50kb and can be loaded offline to continue to work. All written in about 20 to 30 lines of code. No need for a large LLM computed thing with a ton of Nvidia GPUs that used bolts of electricity for a text analysis model and then a voice synthesis module. When this above does all the same with a lot less. Thanks to the maintainers of this lovely SAM speech synthesis library from the 90s. <a href="https://github.com/HeraldOD/sam">SamJS</a>.
</small>
