# (meandering & disorganized) Reflections after 1 year of Vanilla JS

### May 2023

Note: see [here](/vanilla-reflections-pt2) for my latest, post-layoff reflections.

I have been writing frontend code in vanilla JavaScript at [CoinMetrics](https://coinmetrics.io/) for about a year, and I want to spend some time reflecting on the approach.

I really enjoy using (verbose) vanilla JavaScript - I find syntactic sugar confusing and annoying a lot of the time. JSX tastes more salty than sweet to me - I don't find it helpful to have what is ultimately a function call look like quasi-html. Maybe at some point I'll get tired of typing the word `document` but it's fine for now.

I really enjoy the opportunity to learn lower level stuff. It's equal parts annoying and rewarding to deal with the intricacies of the cookie API. At this point in my career, I'm happy to learn anything.

I really enjoy using Node.js directly - I find it helpful to know what I'm actually instructing the computer to do. No I don't think that means "think about memory busses and microprocessors every time you write a helper function" but it does mean understanding how data moves through a filesystem or a network. Abstractions are cool, but often leave me scratching my head - `app.get(...)` - "what did I just do?" Having to manually parse URLs and write routing logic is informative - "ohh, ok this is what we're doing here - makes sense." Ditching abstraction demystifies the process - it's just information being manipulated and passed around.

I appreciate, to some extent, the freedom to organize a UI as I please, although this is a double edged sword. I think mostly the educational benefit is to consider, "How would I do this in React?" I suppose there is something to be said for the skill of finding one's way around a project that is not organized like anything you've ever seen before.

All that said, there are a few things I'm growing wary of. The first is our almost complete lack of dependencies. As much as I enjoy learning the minutae of the cookie API... there may be knowledge that's, idk, more worth my time.

On that note, I'm starting to think it's impossible to "keep up" without _at least_ dependencies, if not a full-on framework. I was tasked with creating a virtualized list a-la [react-virtualized](https://www.npmjs.com/package/react-virtualized). It works fine, but it was challenging to implement, and there's just no way I can compete with version 7 of an open source library with issue tracking and >2M weekly downloads.

One other reality is that, for better or worse, most people don't want to write web software without frameworks or dependencies. So it's hard to hire people. This is less a philosophical argument against vanilla, more a practical one. I get it - the number of people who do a thing doesn't _necessarily_ imply its superiority. But sometimes I think it's tempting to take a contrarian point of view - that something's popularity implies its inferiority.

One of the strongest arguments I heard initially for vanilla: if you know what you're doing, you don't need a framework. I think there's 2 things to explore with this.

First is the feasibility of "knowing what you're doing" (aka knowing basically everything about web APIs, protocols, browser rendering engines, ...). I really, really do think there is tremendous value is deepening our knowledge, understanding more about what is actually happening, the where's and the why's of things. I love that type of learning.

But... idk, there is plenty to learn. Using a date library may mean I don't have to stumble through documentation (yet again) to half-solve a problem that someone was already kind enough to iron out. I suppose there's a missed opportunity for learning here. Or I could just... spend time learning something else.

The other half of the argument is "... then you don't need a framework". The tacit implication is that, equipped with sufficient knowledge, you wouldn't even _want_ a framework because of how they can complicate things. Honestly I don't know if I agree with this. Knowing _how_ to manually query and manage the DOM doesn't necessarily make me prefer doing it that way. Knowing more about CSS rules doesn't necessarily make me want to think about styles according to its cascading paradigm. Knowing the math behind spring-based animations doesn't mean I'm excited about doing it by hand every time. The jury is still out. (FWIW I understand there are distinctions, even within React, between libraries and frameworks - but my current professional work is largely devoid of both.)

Something I reflect on a lot: how deep ought my knowledge be? I don't know that memorizing bit transmission rates through various metals will be that helpful, at least not in my current role. I also don't like to shy away from things just because I don't explicitly "need" to know them. But perhaps that's just more a question of time allocation - using React in my professional work doesn't prevent me from reading more about web security or operating system design.

Above I discussed `app.get()`, and how ditching server-side frameworks has helped me learn a lot more about what's going on in the request-response ballet. I think there are 2 important caveats: 1. is a job really the place for classroom-style "do it the long way for a while then I'll show you a shortcut once you understand it" methods? 2. is there not something extremely valuable about being able to look at a function or a tool or an API, understand its signature, and use it _without understanding how it's working under the hood_? I wonder if, to some extent, my desire (read: compulsion) to know how everything works stems from a lack of skillfullness with the craft - it's crucial to be able to operate without total knowledge, to be able to pick up a tool and use it as it is intended to be used despite the vague discomfort inherent in not knowing what's going on inside.

One additional argument about vanilla - "we write 100% of the code so we know what's in there." This point has become less convincing - we may have wrote all the code but that doesn't mean it's good, secure, or maintainable. I suppose it's true that npm packages can have malicious code or security bugs - but are they really more likely to have them than our own code? And from a business perspective, sure, we may be the 1 website that doesn't crash when a widely-used library breaks, but we may not have any clients by that point anyway. Not to say we should be reckless with libraries.

All in all, seems like there's a healthy balance somewhere between "I don't know the first thing about the internet but I can make so much cool shit" and "I write websites in assembly." There may be serious issues with web frameworks and reckless, mindless use of dependencies - but perhaps it's not necessary to throw the baby out with the bath water. I'm sure my thoughts will evolve over time.
