---
title: Making Textmate play nice with RVM
description: Making Textmate play nice with RVM
date: 2011-07-27
layout: layouts/post.njk
---
I finally sat down for a while this morning to get [RVM](https://rvm.beginrescueend.com/) working well with [Textmate](http://macromates.com/) ruby running commands. Whilst pairing with the team at [GoFreeRange](http://gofreerange.com) we tend to stay in Textmate, write tests and then run them from there. But recently using RVM and .rvmrc config files within 1.9.2 projects we haven't been able to get the tests to run.

To make it easier than creating a [textmate rvm wrapper](https://rvm.beginrescueend.com/integration/textmate/), I run rvm so that it sets up the right ruby and paths. Then check if there is a `.rvmrc` and take that into account.

I add these two lines to any Textmate commands (Bundles -\> Bundle Editor -\> Edit Commands...) for example the `Ruby -> Run` command.

    [[-f "$HOME/.rvm/scripts/rvm"]] && . "$HOME/.rvm/scripts/rvm"
    [[-f "$TM_PROJECT_DIRECTORY/.rvmrc"]] && . "$TM_PROJECT_DIRECTORY/.rvmrc"

