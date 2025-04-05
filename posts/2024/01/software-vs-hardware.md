---
title: Software vs Hardware
description: Software vs Hardware and how it's led me to use an old linux thinkpad.
date: 2024-01-28
layout: layouts/post.njk
tags: ["computers"]
---

It's a Sunday morning, I'm drinking my aeropress espresso, reviewing some old scanned fuji velvia photos from Japan. I started to wonder something.

In my time working with technology I've always joked about the shift between client compute vs server compute. For pretty most of 2000s we've known about cloud compute, everything get's pushed up to the cloud before being worked on. But there was once a time in computing where the desktop machine was designed to perform work without a network connection.

I started to wonder what if we were to do this again in computer science. Have software handle higher complexity over hardware. To better explain let me share some work I've been doing with multimedia (images/video)

The first decoder I saw was an AVI software driver that allowed full screen video playback, a music video from Weezer, buddy holly on the Windows 95 cdrom. Then came along video hardware acceleration because the codec algorithm could be performed faster on hardware. This means that today video handling is pretty much done by hardware. It's power efficient, increases frame rates, resolutions, etc. For those that understands linux operating systems, you'll know the pain of having to get web video content to use harware acceleration.

But why is this? I started to wonder if teams have looked into different methods of multi-media capture and playback. The file formats we use today we designed in a time where compute was very different. WAV file, 1991, MOV 1991, MP4 which is based on MPEG 1998. In my work to prototype a portable music looper, i started looking at different audio byte stream storage methods to ensure I was getting the most of the 5V usb power supply and multi-track channelling. In this exploration I found that the data formats to be limiting in how the parallel compute could be leveraged in that layer of store and loading.

For this reason, I've chosen to use one my oldest laptops to continue this work but has the best keyboard as I know I'm going to be typing a lot. A lovely old thinkpad x250 (i5, 128GB SSD, 8GB RAM, 720p), it's been great having the thinkpad pointer and ports, ethernet/usb-a, no usb-c though.

This choice is forcing me to explore and further research what is possible with software rather than hardware. I've setup arch linux OS, i3, tmux, vim, zsh and web browser. It's faster to use and I'm able to turn on the machine in seconds, not requiring a hibernate/suspend. I'm only using X windows when I need to browse the web for reference material. I'm also not requiring Xcode for swift applications, online video streaming or video calls at the moment. I'm next digging into how best to render pixels in Xorg to better understand what options there are for developers wanting to learn more about data streams and rendering of them.

I'll leave you with this thought. What if no new computer/mobile hardware was manufactured for the next 5 years. We naturally would want more out of what we have, faster, higher quality tools. This would naturally lead us to modify what we already own and get more out of them.
