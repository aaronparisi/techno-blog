# What happens if you pass a string to server.listen()? - and other questions you probably never wanted to have to find the answers to in the first place.

### May 2023

This post is to summarize rabbit hole that spanned 6 hours and [these](https://stackoverflow.com/questions/76205174/why-is-nodejs-saying-the-port-is-in-use/76205312#76205312) [two](https://stackoverflow.com/questions/76205903/what-happens-if-i-pass-server-listen-a-string-for-a-port/76205926?noredirect=1#comment134388571_76205926) StackOverflow posts.

The setup: I needed to spin up a node server. In a previous project, I had included the following line _directly in the server code_:

```js
const PORT = process.env.PORT || '8080';
```

I have been moving toward putting environment variables in a `.env` file - remembering to add them all at the command line was becoming tedius. Without thinking too much, I threw an additional line in my `.env` to specify the port:

```js
SOME_KEY = aaaaaaaaaaaaaaa;
SOME_SECRET_KEY = bbbbbbbbbbbbbbb;
SOME_OTHER_THING = ccccccccccccccccc;
PORT = '8080';
```

For context, here are some relevant parts of my server file. First, how I parse `.env`:

```js
const dotEnv = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
dotEnv.split('\n').forEach((line) => {
  const [key, val] = line.split('=');
  process.env[key] = val;
});
```

And here is the server code itself:

```js
const main = () => {
  log(`Starting api server`);

  const exit = (signal) => {
    server.close(() => process.exit());
    log('Server is closed.');
  };

  const server = http.createServer(handleRequest);
  server.listen(process.env.PORT, process.env.HOST, (e) => {
    if (e) {
      log(`server.listen() returned error: `, e, process.env.PORT);
      return;
    }
    log(`Server is listening on ${process.env.HOST}:${process.env.PORT}`);
  });

  process.on('SIGING', exit);
  process.on('SIGTERM', exit);
  process.on('uncaughtException', (err, origin) => {
    log(`Process caught unhandled exception: ${err} ${origin}`, 'ERROR');
  });
};
```

I popped over to the command line to run the server:

```js
$ node server.js
[ 2023-05-09T05:45:16.009Z | INFO ] Starting api server
[ 2023-05-09T05:45:16.012Z | INFO ] Server is listening on 127.0.0.1:"8080"
```

I thought this was a little odd... had I ever seen the port in quotes before? _shrug_

As one does, I `ctrl-c`'d, made some changes, and tried running the server again:

```js
$ node server.js
[ 2023-05-09T05:45:16.009Z | INFO ] Starting api server
[ 2023-05-09T05:19:06.464Z | INFO ] Process caught unhandled exception:
  Error: listen EADDRINUSE: address already in use "8080" uncaughtException ERROR
```

Huh... I've seen this type of thing before if I don't handle `SIGINT` properly - no big deal, quick google search, `lsof -i :8080`, should be good to go.

Except `lsof` didn't show anything. No. Matter. What. I tried a dozen different `lsof` invocations with different flags. I tried various `netstat` commands. `fuser`. `ps`, `ps aux`. I tried `npx kill-port`, and some utility called [htop](https://formulae.brew.sh/formula/htop).

I restarted the computer.

Nothing was working. Node kept insisting something was using that port, yet I couldn't get anything to show me what was running on the port.

Thanks to [this](https://stackoverflow.com/questions/76205174/why-is-nodejs-saying-the-port-is-in-use/76205312#comment134387386_76205174) comment, I did a quick experiment - what would the server output be if I set `process.env.PORT = "8080"` directly in the server file itself?

```js
$ node server.js
[ 2023-05-09T05:45:16.009Z | INFO ] Starting api server
[ 2023-05-09T05:45:16.012Z | INFO ] Server is listening on 127.0.0.1:8080
```

Well THAT'S interesting. So when I set `process.env.PORT` to a string (`8080`), then pass said string to `server.listen()`, everything works as expected. Running `lsof -i :8080` shows the process.

Ok so at this point I'm kicking myself - duh, when I read the variables from `.env`, they are strings. BUT for `PORT` I read the string `"8080"` - with quotes embedded in the damn string.

At this point the fix is clear - don't put fucking quotes in the `.env` file. Like all the other variables in there that I failed to look at when adding `PORT`. Whatever.

But now I'm scratching my head - so all this time I've been passing strings to `server.listen()`?? What happens when I pass it a string as the first param??

First things first: ask ChatGPT. Their answer was that `server.listen()` performs `parseInt()` on its inputs. Experiments time.

When setting the environment variable in the server file via `process.env.PORT = "8080"`:

```js
console.log(
  process.env.PORT,
  typeof process.env.PORT,
  parseInt(process.env.PORT)
);
// 8080
// string
// 8080
```

When reading the erroneously double-double-quoted variable (`PORT="8080"`) from `.env`:

```js
console.log(
  process.env.PORT,
  typeof process.env.PORT,
  parseInt(process.env.PORT)
);
// "8080"
// string
// NaN
```

Hm ok interesting. So initially I'm thinking "when I pass a non-parsable string to server.listen, it should... not work." AND YET! It did "work". The server started listening, per the execution of my logging statements. Inspecting things further:

When setting in server file:

```js
console.log(server.address(), server.listening);
// { address: '127.0.0.1', family: 'IPv4', port: 8080 }
// true
```

When reading from env file:

```js
console.log(server.address(), server.listening);
// '"8080"'
// true
```

Dumbfounded at this point. I'm under the impression that when I pass the string `"8080"` to `server.listen()`, `parseInt` returns `NaN`, so there should be an [error](https://github.com/nodejs/node/blob/main/lib/internal/validators.js#L383). I'm also under the impression that [server.address()](https://nodejs.org/api/net.html#serveraddress) should be the object I see in the first case, not the string I see in the second.

What the fuck is port "8080" anyway???

[This answer](https://stackoverflow.com/a/76205926/5221310) was very helpful - apparently Node.JS has _multiple signatures_ for [server.listen()](https://nodejs.org/api/net.html#serverlisten). Wow. I'm still not sure the exact mechanisms but I inadvertantly instructed node to [start an IPC server](https://nodejs.org/api/net.html#serverlistenpath-backlog-callback) with the path "8080".

If I said `server.listen('fake', ...)`, same situation - server listens with `server.address()` being a string `'"fake"'`.

Woof.

So my next question was: ok how do I kill these damn things? I would start an IPC server with string `"8080"`, kill it, then try again, and get the `EADDRINUSE` error over and over again no matter what. Incrementing the port to `"8081"` again works only once, then `EADDRINUSE`.

ChatGPT suggested `lsof -U` which [selects the listing of UNIX domain socket files.](https://man7.org/linux/man-pages/man8/lsof.8.html)

I saw one in there called 'fake' so I killed that process. But still couldn't restart the server on that "address" a 2nd time.

ChatGPT suggested running `find` to look for any files named `fake` and lo and behold I found some - along with files named `8080`, `8081`, `3000`, `3001`, `3002`. _In my project directory._ They were listed with a trailing `=` so `'"8080"'=` and `fake=`. Permissions were new to me as well:

```js
srwxr-xr-x 1 aaronparisi staff    0 May  8 21:45 fake=
```

Deleting these... erm... "entities" finally cleared up the `EADDRINUSE` error. I'll have to spend some time reading about IPC servers.

The other issue was a fucking typo - I had `SIGING` instead of `SIGINT`. Lol.

Lessons learned: be careful with quotes in the `.env` file! Also that software development is hard [for reasons I don't always expect](/blog/on-the-test).
