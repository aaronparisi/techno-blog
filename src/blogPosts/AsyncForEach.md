# Exploration of some async-ness

#### May 2023

I am rewriting the API for a toy Air BnB clone from Rails to Node.js. While working on seeding [the database](https://node-postgres.com/apis/pool), I ended up having a good 1-on-1 with ChatGPT, and wanted to discuss some of the takeaways.

The situation: each seed `user` has some number of properties that they "manage." The code looks like this:

```js
console.log('seeding user: ', usr.username)
const userId = await pgClient.query(`
  INSERT INTO users (id, username, email, password_hash, password_salt)
  VALUES (DEFAULT, $1, $2, $2, $3) RETURNING id;
`, [
  usr.username,
  usr.email,
  [...hashAndSaltPassword(usr.password)],
])
usr.properties.forEach(async prop => {
  const propId = await pgClient.query(`
    INSERT INTO properties (id, title, description, ...)
    VALUES (DEFAULT, $1, $2, ...) RETURNING id;
  `, [
    prop.title,
    prop.description,
    ...
  ])

  // stuff with the propId
```

Despite it being the 2nd sentence of the docs, I forgot that await [can only be used inside an async function or at the top level of a module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await). The quick solution is to mark the `forEach` callback as `async`, but I had the thought to refactor the function using promises:

```js
console.log('seeding user: ', usr.username)
const userId = await pgClient.query(`
  INSERT INTO users (id, username, email, password_hash, password_salt)
  VALUES (DEFAULT, $1, $2, $2, $3) RETURNING id;
`, [
  usr.username,
  usr.email,
  [...hashAndSaltPassword(usr.password)],
])
usr.properties.forEach(prop => {
  pgClient.query(`
    INSERT INTO properties (id, title, description, ...)
    VALUES (DEFAULT, $1, $2, ...) RETURNING id;
  `, [
    prop.title,
    prop.description,
    ...
  ])
    .then(propId => // stuff with the propId)
```

I don't think there is anything _wrong_ with this approach, but I began to wonder about subsequent iterations of the `forEach` loop - specifically in the context of executing concurrent `INSERT` queries on the same table in a database.

ChatGPT told me that `await` ensures that the subsequent iteration does not start until the current iteration finishes completely. I don't think that's correct, but we'll come back to that. At this point, I was wondering if I could prevent a `forEach` loop's subsequent iteration _without_ `await` (although I don't specifically remember why that question occurred to me). ChatGPT gave me 2 options:

One option, termed the "continuation-passing style," favored recursion over loops:

```js
function fetchUrls(urls, callback) {
  let index = 0;

  function next() {
    // fn to be called recursively
    if (index >= urls.length) {
      callback();
      return;
    }

    const url = urls[index++];
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Do something with the data
        next(); // this has to "await" the http request
      });
  }

  next();
}
```

Another option was to force the loop's body to be synchronous, such as `xhr.open("GET", urls[i], false)`. I asked: "what is the difference between blocking execution of a for loop via `const result = await fetch(...)` and blocking execution of a for loop with a synchronous xmlhttp request `xhr.open(..., false)`?" - and the response was:

> The main difference between blocking execution of a for loop via await fetch and blocking execution with a synchronous XHR request (xhr.open(..., false)) is that await fetch is non-blocking and does not block the main thread, while a synchronous XHR request is blocking and can cause the main thread to freeze.
> When you use await fetch, the JavaScript engine can continue executing other code on the main thread while the fetch request is in progress. Once the response is available, the await keyword causes the JavaScript engine to pause execution of the current function until the fetch request completes and the promise resolves.
> In contrast, a synchronous XHR request blocks the main thread until the response is received. This means that the browser cannot respond to user input or execute any other JavaScript code until the XHR request is complete. This can cause the user interface to become unresponsive and negatively impact the user experience.
> Therefore, it's generally better to use asynchronous requests with callbacks or promises, or async/await if it's available, instead of synchronous XHR requests."

At this point I was like "oh duh obviouisly" - preventing the execution of some subsequent lines of code in a particular function is not the same as blocking the main thread. For whatever reason though it _clicked_ and I found that explanation insightful. Remember: I am _trying_ to block the execution of the loop (and am still under the impression that `await` will do this for me). In any event, - duh, one way to block execution of the next loop iteration is to literally block the entire engine.

Aside: one additional avenue provided by ChatGPT involved "tying" the next iteration's body to the resolution of the previous':

```js
function runLoop(numIterations) {
  let promise = Promise.resolve();
  for (let i = 0; i < numIterations; i++) {
    promise = promise.then(() => {
      // we are forced to wait, even if promise is resolved already
      // I don't run until last iteration's promise resolves!!
      return myCustomFunction();
    });
  }
  return promise;
}
```

Another aside: I was reflecting on things like `Promise.resolve` or `setTimeout(() => { ... }, 0)` and came across [this article](https://javascript.info/event-loop) detailing the micro- and macro-task queues.

In any event, this was not a satisfactory solution - it does not prevent the next iteration from _starting_, even if it does force each iteration's functionality to wait for the resolution of that of the previous. Sadly it also executes `myCustomFunction` `numIterations` times. An experiment:

```js
[1, 2, 3, 4, 5].forEach(async (el) => {
  console.log('hello from the next iteration of the forEach loop, el: ', el);
  const res = await new Promise((resolve) => {
    console.log('making a new promise!'); // does not wait for loops to finish!
    return setTimeout(() => {
      console.log('timeout is finished');
      resolve(el);
    }, 1000);
  });
  console.log('done "await"ing, res: ', res); // res should === el
});
```

... resulting in:

```js
hello from the next iteration of the forEach loop, el:  1
making a new promise!
hello from the next iteration of the forEach loop, el:  2
making a new promise!
hello from the next iteration of the forEach loop, el:  3
making a new promise!
hello from the next iteration of the forEach loop, el:  4
making a new promise!
hello from the next iteration of the forEach loop, el:  5
making a new promise!
timeout is finished
done "await"ing, res:  1
timeout is finished
done "await"ing, res:  2
timeout is finished
done "await"ing, res:  3
timeout is finished
done "await"ing, res:  4
timeout is finished
done "await"ing, res:  5
```

Foiled again!! Note that in the latest example, I am not _reassigning_ any promises. ChatGPT then told me to use a `for...of` loop:

```js
async function example() {
  for (const el of [1, 2, 3, 4, 5]) {
    console.log('hello from the next iteration of the for loop, el: ', el);
    const res = await new Promise(resolve => {
      console.log('making a new promise!')
      return setTimeout(() => {
        console.log('timeout is finished')
        resolve(el)
      }, 1000)
    })
    console.log('done "await"ing, res: ', res)  // res should === el
  }
}

// RESULTS:

hello from the next iteration of the for loop, el:  1
making a new promise!
timeout is finished
done "await"ing, res:  1
hello from the next iteration of the for loop, el:  2
making a new promise!
timeout is finished
done "await"ing, res:  2
hello from the next iteration of the for loop, el:  3
making a new promise!
timeout is finished
done "await"ing, res:  3
hello from the next iteration of the for loop, el:  4
making a new promise!
timeout is finished
done "await"ing, res:  4
hello from the next iteration of the for loop, el:  5
making a new promise!
timeout is finished
done "await"ing, res:  5
```

Apparently this works because `for...of` is built on the [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols), and the way "moving on to the next iteration" relies on the invocation of the `next()` method. Time for further reading.
