---
layout: blog-post
draft: false
date: 2021-09-12T02:53:53.474Z
title: React中PureComponent的浅比较
description: PureComponent是react中创建组件的一种方式，可以减少不必要的更新，进而提升性能。这也是React应用性能优化的一种方式。
quote:
  content: 'As God is my witness,I''ll never be hungry again.'
  author: Gone with the wind
  source: ''
tags:
  - React
  - JavaScript
---
## PureComponent实现原理
PureComponent是react中创建组件的一种方式，可以减少不必要的更新，进而提升性能，每次更新会自动帮你对更新前后的props和state进行一个简单对比，来决定是否进行更新，浅比较通过一个shallowEqual函数来完成：

```JavaScript
if (ctor.prototype && ctor.prototype.isPureReactComponent) { // 先判断组件是否继承的PureComponent
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }
```
shallowEqual的源码为：

```JavaScript
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (
      !hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}
```
shallowEqual函数完成的功能：
1. 通过is函数对两个参数进行比较，判断是否相同，相同直接返回true：基本数据类型值相同，同一个引用对象都表示相同。
2. 如果两个参数不相同，判断两个参数是否至少有一个不是引用类型，存在即返回false，如果两个都是引用类型对象，则继续下面的比较。
3. 判断两个不同引用类型对象是否相同
> 先通过Object.keys获取到两个对象的所有属性，具有相同属性，且每个属性值相同即两个对相同（相同也通过is函数完成）

其中is函数是自己实现的一个Object.is()的功能，排除了===和Object.is()两种不符合预期的情况：

```JavaScript
+0 === -0  // true
Object.is(+0, -0) // false
NaN === NaN // false
Object.is(NaN, NaN) // true
```
下面是is函数的实现，也是Object.is()的实现原理：

```JavaScript
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant,排除 +0 === -0的情况
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN,x和y都不是NaN
    return x !== x && y !== y;
  }
}
```
## 何谓"浅比较"
根据以上代码，可以得知，所谓的浅比较，指的就是这行代码!is(objA[keysA[i]], objB[keysA[i]])。可以看到，在比较两个对象中属性的属性值的时候，是直接采用Object.is的方式进行的比较，如果对应属性值恰好是基本类型值当然没有问题，但是如果，恰好对象中的该属性的属性值是引用类型的值，那么比较的仍旧是引用，而不是对象的外形。于是可能出现这种情况，当ObjA和objB的对象外形一致，按道理说不需要更新，但是由于其中某个相同属性的属性值是引用类型，而他们虽然外形也是一致的，但是引用不同，那么!is(objA[keysA[i]], objB[keysA[i]])仍旧会返回true，最终导致shallowEqual函数返回false（这样shouldComponentUpdate方法会返回true），从而导致组件出现无意义的更新。

## 为何不"深比较"
那么为什么这里会采用“浅比较”呢？这其实也是出于对于性能的考量。我们都知道，在js中，对引用类型外形进行的比较，实际上是需要通过递归比较才能完成（深复制引用类型也需要通过递归完成）。而在组件更新判断的生命周期中不断执行递归操作去比较先后的props和state对象，毫无疑问会产生较大的性能开销。所以这里只能折中，采用浅比较的方式。当然副作用就是，仍可能出现没有必要的重新渲染（也就是两个对象的外形一致，但其中的某些属性是引用类型，这样即使引用类型属性值的外形也是一致的，浅比较依旧判定这两个对象不同，从而导致多余的重新渲染）。

## Object.is() 做的事情
Object.is() 判断两个值是否相同。如果下列任何一项成立，则两个值相同：
- 两个值都是`undefined`
- 两个值都是`null`
- 两个值都是`true`或者都是`false`
- 两个值是由相同个数的字符按照相同的顺序组成的字符串
- 两个值指向同一个对象(也就是基地址相同)
- 两个值都是数字并且
  - 都是正零`+0`
  - 都是负零`-0`
  - 都是`NaN`
  - 都是除零和`NaN`外的其它同一个数字

这种相等性判断逻辑和传统的 `==` 运算不同，`==` 运算符会对它两边的操作数做隐式类型转换（如果它们类型不同），然后才进行相等性比较，（所以才会有类似 `""` `==` `false` 为 `true`的现象），但 `Object.is` 不会做这种类型转换。

与`===`运算符也不一样。`===`运算符（和==运算符）将数字值-0和+0视为相等，并认为`Number.NaN`不等于`NaN`。






