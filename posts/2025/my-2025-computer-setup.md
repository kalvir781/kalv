---
title: New daily mac linux setup
description: What I'm using for my daily computer setup
date: 2025-03-14
layout: layouts/post.njk
tags: ["computers"]
---

I've been getting back into hacking and practising my mind with some complex programming with this website and I thought I'd share the details of the machine I have setup.

I've loved my macbook air m2 since using it at length in my travels including Mexico City and Puerto Escondido. But Mac OS has really let me down, once in an update when living in White Rock, Vancouver. It bricked the whole machine! After getting Mac OS back up and running, I decided to run linux on it.

The brilliant project, [Ashai Linux](https://asahilinux.org/) runs amazingly well and has upgraded from the original arch base to use Fedora. The package support has been brilliant. Just takes a bit of getting used to, with the `dnf` package manager.

It uses Gnome 47 and I've installed only one gnome extension to see the CPU and network activity called system monitor.

The default browser is [Firefox](https://www.mozilla.org/en-GB/firefox/new/) and has a lot optimized, specifically running YouTube without killing the CPU. Most of the time with linux installations the web browser doesn't VAAPI configured to take advantage of GPU rendering, not this one.

I'm still using a tmux and vim like I always have. Always allowing me to use my fingers at the keyboard and no mouse. Configured for fast windowtabs and vertical splits as required between the code and a terminal. I use the default gnome terminal with Solarized colorscheme.

Current vim plugins:
- [ag.vim](https://github.com/rking/ag.vim) - Using the silver searcher with fzf for the fast lookup of files in a project
- [vim-colors-solarized](https://github.com/altercation/vim-colors-solarized)
- [ale](https://github.com/dense-analysis/ale) - for async syntax checking 
- [vim-fugitive](https://github.com/tpope/vim-fugitive) -for the rare times I need to do a GRead to read the original file from the git repo

Applications I've installed that I use
- [SongRec](https://github.com/marin-m/SongRec), which is so much fun, it's an unofficial client to detect the songs with Shazam. I've had to use a pair of headphones that has an inline microphone because Asahi linux does not support the macbook microphones as yet.
- [VLC](https://www.videolan.org/) - for video work for x264, but x265 doesn't work and I've been tinkering with this to get that working. Had to compile a version of Handbrake to allow encoding videos that are in x265 to x264 which hasn't really panned out yet.

With all of my linux laptop setups, I startup `powertop` and see what optimizations I can run on the PCI devices and other components to ensure the battery consumption is the lowest it can be.
Then monitor a number of device information on the power consumption to see what else might be drawing a lot of power. I found that the 'wifi' and the 'processor cpu freq scaling' to be the two issues. To fix the wifi, I added 'wifi.powersave' configuration to the 'NetworkManager' which better conserves the power of that. Then for the processor 'TLP' and configured it to ensure the cpu freq scales better.

So far I've been using the computer for HTML/JS programming and it has given me about 2 hours for 7% battery on the macbook air m2! So it's ready for great offline working.

I'll update my blog with other updates of success on it's configuration.
