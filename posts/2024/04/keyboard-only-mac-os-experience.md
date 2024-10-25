---
title: Couch Computing
description: Keyboard only experience review note that turned into something else
date: 2024-04-09
layout: layouts/post.njk
---

This post originally was intended to be about sharing that I couldn'n turn on bluetooth on the couch and there is probably a really easy shortcut but I'm old school and just expect tab and space to work on UIs. I ended up outlining more of the couch setup I used to publish this post.

...

I've been using my computer from the couch in the evenings and felt like sharing this in the the hope that others might find it useful.

...

On the couch, I've been using a setup that allows me to just have a keyboard and utilize the large LCD every home has, the TV.

For my keyboard I use an [OLKB planck](https://olkb.com/collections/planck). This allows me to enter more input options in a limited amount of hand space. It might have a complex learning curve. But when you get the hang of it, you can enter a lot more special characters, which is great when working in a text editor like [VIM](https://vim.org).

It's good to have a nice long cable for the keyboard to the macintosh. A USB-C Dongle with HDMI output to the TV.

The default mac Terminal app for word processing and multi tasking. `CMD + +` became my friend a lot.

My couch bluetooth headphones, Apple Airpods Max because of the spatial audio, sometimes through the Apple TV to allow the music to continue playing when the mac would be turned off. Also as I find it has the best sound isolation. Living in an apartment right now so the washer and dryer can be quite loud.

I still use [Divvy]() to allow for windows to left and right, Safari for accessing, Google for searching the internet.

On my trackpad, I have `Tap to click` enabled to allow for me to easily tap the trackpad on the couch.

For publishing, I use the fastest Git to URL setup I like that is simple and has remained workng for years now. That's [Eleventy](https://www.11ty.dev) which powers this blog. Allowing for me to just push Markdown directly to a Git repo which does all the magic for me.

To navigate around the operating system I use spotlight. `Cmd+space` to open Terminal. And then I would punch in say `vim for-the-i.md` to start making notes. In this specific article it was that I couldn't enable bluetooth after getting there from Spotlight. I do see that there is a toggle there but not sure of the keyboard combination to enable it.

Here's a photo the setup.
![Keyboard Only Setup](/img/posts/2024/keyboard-only-setup.jpg "Keyboard Only Setup")

Before hitting `git push` on this article, I did get the trackpad working in the end, just had to plug in a cable and charge it up. △

## A little extra
Here are some steps that I use to copy a photo from the SD card using my terminal setup.

- Back in my lovely Terminal app, of which I use the [https://github.com/morhetz/gruvbox](https://github.com/morhetz/gruvbox) lovely color scheme.
- `cd /Volumes/NAME OF SD`
- Most of the time you can `cd` into the directories and find the `JPG`, for me it's `cd /Volumnes/Untitled/DCIM`. If you're finding it difficult to understand the directory structure, I love firing this command `find .` and then scrolling through the files.
- When in the right directory, I use `ls -alrt` such that the last image taken is listed
- `cp ./_123.jpg ~/me/projects/kalv-dev/img/posts`
- To reduce the size of the image so that it's easily embeddable in my blog. `brew install imagemagick` (to ensure I had convert installed).
- `convert keyboard-only-setup.jpg -resize 800x800^ keyboard-only-setup-small.jpg`, this gives me a fixed width of 800px on the image
- I use `mv` and `cp` commands to change the filename if need be after.
- I was going to then work through and share some commands on how to reize the image via the CLI for those that only use the keyboard but I'm spending too much time on this article and need to return to my job hunt.
