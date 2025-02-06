---
title: Weave
description: Sharing a design for better compression of video and images
date: 2025-02-04
layout: layouts/post.njk
tags: ["computers"]
---

Sharing a design for faster video and research I’ve done in the multimedia space.

First off, AVIF image files, `convert image.jpeg image.avif` for much smaller images.

To faster encode dvd rips on a macbook air m2 (the base model) at 1000fps. I’ve been ripping Battlestar Galactica and other old series I’ve want digitized. Use [Handbrake](https://handbrake.fr/) and then use these settings:

Pick the Video Encoder of H.265 (VideoToolbox), it’s the optimizations of using the VideoToolbox mac native libraries to ensure faster encoding with low power consumption. And you can use any other quality settings you’d like. I’m sure this encoding would run faster on a macbook pro or other modern versions of the mac. It would be great to see more software optimized for this.

Design for optimized video, using what I was calling Weave. A project that I didn’t get funding for last year. 

1. Essentially we can store a map of the pixels used in an image, for this walkthrough, I’ll say it’s a blue sky image. An image of just shades of blue.
2. These shades of blue could be extracted into a one line image buffer and those pixel references can then be used to draw out the image using GPUs or fast CPU optimizations
3. Meaning the data footprint of an image frame is much smaller than what is currently stored

Today, most video/images raw, are in a bytestream raw io and then compressed post. The method above is one that could optimize the raw data from the start. Obviously would require more investigation on the stitching stage of creating the frame.

If this method is then used for video, each frame would have a considerable saving of re-using pixel data.

I'll share more as I work on this.
