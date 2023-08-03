# Is JavaScript pass-by-value or pass-by-reference? This and other age-old questions.

#### April 2023

This is a question I've asked and researched probably 3 times already. Maybe this time it will stick.

My understanding of the situation is this: that JavaScript is purely pass-by-value, with an odd caveat.

In the case of an object, say `const obj = { prop1: 1, prop2: 2 }`, the value assigned to the variable `obj` is not actually the object we instantiated - it is, under the hood, a reference to the memory location of the object. I _think_ it would be as if we said `struct MyObj *p = &someObj`.

So when you pass `obj` to a function like `foo(obj)`, we _are_ passing "the actual value of the variable `obj`" - but it just so happens that this value, sneakily, is a reference.

So when we say `obj[prop2: 'changed']`, we are really saying "change the value of `prop2` of the object stored at the memory address stored in the `obj` variable."

The pass-by-value nature of JS is more apparent when passing a primitive, like `const n = 5; foo(n)`. In this case, the value of the argument will be the value of n, which is simply 5.

It's worth pointing out that naming a function parameter the same as the variable passed to it can confuse the situation:

```js
let x = 4;
const foo = (x) => {
  x = 5;
};
foo(x);
console.log(x); // 4
```

and that the above is different than the below:

```js
let x = 4;
const foo = () => {
  x = 5;
};
foo();
console.log(x); // 5
```

This clears up some confusion I had around the following example, modified from [this](https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language) SO post:

```js
const foo = (x) => {
  x = { prop3: 3, prop4: 4 };
};
const x = { prop1: 1, prop2: 2 };
foo(x);
console.log(x); // { prop1: 1, prop2: 2 }
```

Here, we _are_ passing by value, and that value is a reference to an object with `prop1` and `prop2`. Modifying `x` in the function body does NOT modify `x` outside the function: if we said `x[prop3] = 3`, under the hood, JS engine interprets that as an instruction to modify the `prop3` value of the thing located where `x` points. In this case, it matters not whether the `x` inside the function is "the same" as the `x` outside the function - both variables now have, as their value, the location of some object, and making modifications to the properties of the object stored at said location will... well it will modify that single object.

BUT, when we say, inside a function, `x = {...}`, we are saying "change the value of the variable x - which exists only within the context of the execution of this function, and which shadows the variable `x` from outside the function - to a reference to a new object. For example:

```js
const foo = (obj) => {
  obj['prop3'] = 3; // modifies the object stored at the location referenced by the obj param
  const obj2 = Object.assign({}, obj); // new variable whose value **points to** a new object
  obj2['prop4'] = 4; // modifies the properties of the new object
  return obj2;
};
let obj = { prop1: 1, prop2: 2 };
let objMod = foo(obj);
console.log(obj); // { prop1: 1, prop2: 2, prop3: 3 }
console.log(objMod); // { prop1: 1, prop2: 2, prop3: 3, prop4: 4 }
```

Now, FWIW, all of this exploration was inspired by curiosity about how to best modify an array parameter like `const shuffledArr = shuffleArr(getSomeArray())`. Here we don't have to worry so much about modifying the wrong array - there never is any variable outside the function. This means no need to make some copy like `tempArray` and modify that. But, for much the same reason, we _do_ have to ensure `shuffleArray()` _returns_ the modified array. This was a gotcha for me - another way would be:

```js
const shuffleArray = (array) => {
  // stuff
  array[i] = array[j];
  // stuff
};
let array = getSomeArray();
shuffleArray(array);
```

In this example, the array declared outside the function is modified by the execution of the function.

Another illustration:

```js
const modifyArray = (array) => {
  array.push('added');
};
let a1 = [1, 2, 3, 4, 5];
modifyArray(a1);
console.log(a1); // [1, 2, 3, 4, 5, 'added']
```

I tried this with like 100 `modifyArray` calls - for some reason I was under the impression that greatly increasing the size of the array would cause a reassignment of the function-scoped array.

So then here's a question: we said the "value" of a variable that was assigned to an object is in fact a reference to that object. How can I see said reference?

[This](https://stackoverflow.com/questions/639514/how-can-i-get-the-memory-address-of-a-javascript-variable) says it's not possible, as did ChatGPT:

Q: ok but how can i see the specific memory address stored as x's value

A: In JavaScript, there is no way to directly access the memory address of an object. This is because JavaScript uses a garbage collector to manage memory allocation, which abstracts away the underlying memory addresses from the developer.

[This](https://dev.to/arthurbiensur/kind-of-getting-the-memory-address-of-a-javascript-object-2mnd) was also an interesting read.

Now: what _is_ consciousness, really?
