---
title: Mac private notes
description: Using GoCryptFS to store private notes
date: 2025-04-15
layout: layouts/post.njk
tags: ["computers"]
---

I've been looking for a better way to store private notes and really most of the time, just note designs, architectures and computer programming progress in markdown files.

When I was travelling in Puerto Escodido in November 2023, I used this method and have returned to it. I'm using [GoCryptFS](https://github.com/rfjakob/gocryptfs), which takes a little fiddling to install but once it is. You can simply run these commands and I'm able to have a folder encrypted and backed up across iCloud and TimeMachine.

`gocryptfs -init ./data` for a new folder to be setup as an encrypted data store.

Then to mount it to another folder I simply run `gocryptfs data notes` where notes is a folder in the same directory. Then to unmount it `umount notes`.
