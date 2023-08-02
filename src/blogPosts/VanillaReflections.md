# Reflections after a year of Vanilla JS

### July 2023

Just over a year ago, I turned down a React Developer position to write vanilla JavaScript at [Coin Metrics](https://www.coinmetrics.io), a crypto data analytics startup out of Boston. I was excited to work without "training wheels." Plus, I figured the lower level knowledge would be impressive to recruiters.

Fast-forward a year - laid off suddenly and left with a vague sense that my vanilla JavaScript experience won't be as appealing as I had hoped. Despite learning a _TON_, I feel, in some ways, less "marketable" than I did a year ago.

All in all I'd say this: I really valued writing vanilla JavaScript professionally. I would happily do it again. There's so much to learn. That said... idk it's fucking tedius. And there's plenty to learn even when using web frameworks. In a pragmatic sense, I'd do whatever someone was willing to pay me for, and it does seem like more people are willing to pay for React apps than `http.createServer()` and `document.getElementById()` (and I don't really blame them).

Honestly I think the verbosity and repetitiveness of vanilla JS helped me learn. I enjoyed the challenge of imperative DOM manipulation. I liked learning native APIs, css transitions, Node.js object properties, browser paint behavior. Manually parsing incoming http requests made lightbulbs go off - we're all just moving data around. In that sense, it brought computer code down from the clouds to something that I could actually believe works in physical reality. Abstraction hides so much, and I sometimes find a literal explanation more intuitive.

I appreciated, to some extent, the freedom to organize code as we pleased. The complete lack of conceptual framework required us to concoct our own organizational strategies. I found it refreshing to conceptualize a web page as essentially a text document, manipulated a bit by the robotic arms of the browser's JavaScript engine, rather than a collection of JavaScript-enabled "components."

I also really enjoyed the practice of not reaching for libraries right away. This early in my career, I'm happy to learn anything, and every task provides ample opportunity to hone my thinking and expand my knowledge of computing systems. I got to write raw Node.JS servers. I delved deeper into the [cookie](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies) and [filesystem](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html) APIs than I ever imagined. I got to create a virtualized list from scratch - would be a great interview question.

That said, I do feel some misgivings after my year writing Vanilla.

The first is one of perceived practicality - it's just impossible to move as quickly when writing everything from scratch. From the standpoint of my own education, I find vanilla JS invaluable. But I don't imagine many companies would tolerate the tedium. Not when there are other well-tested, performant tools that, for better or worse, enable devs to push more product.

The second is selfish - I worry that my year writing vanilla JavaScript will be a _deterrent_ to landing my next job. A recruiter might think "wow, cool, so smart..." followed by "... but how well do they know Angular?"

Sure, there is so much to learn underneath web frameworks, but there's plenty to learn no matter what level of abstraction I adopt. I could just as well say vanilla JavaScript is too abstract and build a custom browser that handles pixel manipulation at the operating system level.

Something I reflect on a lot: how deep do I want my knowledge to go? I don't know that memorizing bit transmission rates through various metals will be that helpful, at least not in frontend roles. I also don't like to shy away from things just because I don't explicitly "need" to know them. At any rate, using React in my professional work doesn't prevent me from reading more about web security or operating system design.

Perhaps it's also important to differentiate between "lower level knowledge" and "ability to write software" (although of course there is substantial overlap). What I mean is that a huge part of the craft is digesting an API - whether provided by the browser, by the operating system, by React - to learn which levers it makes available and understand the ramifications of pulling on those levers. Unless I code in binary, I'm trusting some abstraction to do some stuff that I probably won't ever understand completely. The levers provided by React are not inferrior simply because they are at a higher level of abstraction, and software still needs to be crafted skillfully, regardless of which APIs we are using.

I think initially, one of the most appealing arguments for vanilla was something along the lines of: "If you know what you're doing, you don't need a web framework." This may have some truth to it, but ultimately, I think a lot of extremely knowledgable people simply prefer creating user interfaces with tools like React. Imperative DOM manipulation is taxing, even if you know how to do it. Working with dates in JavaScript is tedius, even if you know how to do it. I may know how to build a house without power tools, but I don't know that I would want to.

All in all, I'll probably keep away from writing web servers in vanilla Node.JS, and I'll probably invest most of my time on honing React best practices for any frontend projects I work on. In part because I really fucking love not having to imperatively update the DOM, in part because I just don't see anybody hiring vanilla JavaScript developers. Either way, there will be plenty of checking under the hood.
