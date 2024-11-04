---
title: Forestry sensor design
description: Update on wildfire design thinking
date: 2024-08-13
layout: layouts/post.njk
---

I'm not sure where things are in the news with the current burning of our forests in the world, but know that there are a number ongoing, so as always stay away from the depressing news. Since my [last post](https://kalv.life/posts/2023/08/ok-wildfire/) on whether technology will help us fighting our fires. I've since reached out and spoken to a number of people, prototyped and researched a lot more while I've been applying for jobs.

Had a lovely chat with a gentleman that worked with BC parks to fight fires to learn their methods and what they use. Learnt a lot about the hard work they do to manage the fires and react to them, their techniques and gaps in tooling. I spoke to an [ML company in Alberta](https://altaml.com/industry/forestry-and-agriculture/#:~:text=Using%20data%20analysis%2C%20pattern%20recognition,risk%20for%20the%20following%20day.) about how they were using ML modelling of data to predict the movements of fires of which they were able to process data that they were able to access from previous seasons rather than realtime ML prediction of any going fires. Found a number of companies that build devices like weather stations that won't measure the amount of data or coverage required.

I did a response from the BC minster of forests but did was told that there were a number of projects in motion which was great to hear. Was sent to a job posting page for contractors helping to fight fires, wasn't really the role that I wanted to play for them.  I was hoping to share my work in much more detail, and find partners to work with.

Today I decided to share a quick post outlining my current progress.

My current design is much more different than what I proposed in my last post, I found that data is our largest problem, not being able to capture and analyze data in a cheap affordable method with the least impact on our environment. Even in a discrete computing model rather than a probablistic nueral network (AI/ML) based approach. One that needs to be predictable, accurate and proof being able to provided when explanations are asked to a computer model.

I've been talking and desiging what I call 'digital bees'. These are little devices that can be built with cheap components to be scattered around our forests allowing a ping of data of key sensor data (moisture, temp, wind). I had originally obtained this research and thinking when building my looper for remote music creation, allowing me to think about small hardware embeddable devices and low powered compute.

Currently [Rogers is working with UBC](https://innovation.ubc.ca/about/news/rogers-and-ubc-renew-5g-research-partnership-through-2025) to work on networking, but to truly cover acres of our forests I've been referring to my computer science degree on distributed systems and networks. I believe we options that are better than 5g, I [wrote a paper on 3g](https://www.researchgate.net/publication/2552307_3G_-_3W_What_Where_When) networks in 2003 and a lot of what I wrote then is still true today. Software, data processing protocols, file storage formats are our problem. My design will allow us to utilize AM/FM bands for data transfer similiar to how we used modems on telephone cables. Allowing to mesh transmit data from a node across many in a forest. Allowing cheap replacement and coverage. Excited to perhaps use these 5g towers for base upload nodes that could be in regions to post the mesh pings of data. Not sure on where their designs or progress is.

One aspect, I've been thinking a lot about is the networking. Each device would spin it's own antenna web as it drops into a forest and I've got designs on how to prototype out other radio based network connectivity.

This method will allow us to cross valleys, ridges and other terrain to capture the data we require to measure not only ongoing fires, but also predict ecology for other reasons that just the trees, animal movements and other environmental impact.

Other areas that I've covered so far:
- Prototype build designs, for small forest coverage, am currently planning to see if I can get enough money to buy a plot near a forest where I can prototype with the community.
- Low powered compute to allow for low powered solar/charging lifecycle. Low light pigment sensor power conversion and other methods of power generation.
- Data transmission protocol for low amounts of data over radio.
