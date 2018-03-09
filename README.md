# jQuery imgLazy

基于jQuery实现的图片懒加载插件

## 背景分析

当我们访问一个图片量非常大的网页时，在我们下拉滚动条时往往会看到一些图片会淡入显示出来，这就是对网页中的图片应用了懒加载的处理结果。图片的懒加载，是指网页中的图片默认是不会被加载的，仅当用户可以看到它的时候才会被加载。这样可以有效提高网页的整体加载速度，也可以为服务器端节省一笔可观的带宽资源。试想一下，当用户访问网页的前面一半就离开了，而浏览器则已经将网页下半部分的所有图片都加载了，是不是有点浪费了呢？

为此，我们开发了用于图片懒加载的这个特效组件，该组件的一些特点如下:

1. 为需要懒加载的图片设置一张透明图片作为占位使用，然后将真实的图片地址通过“data-src”属性进行设置，从而让这些图片默认不会被加载；

2. 当用户滑动滚动条时，该组件程序将进行监测，同时会将当前可视窗口内以及位于之前的所有应用了懒加载的图片做加载处理；

3. 可以提供一个布尔值参数（`viewport`)，当为true时表示仅只加载可视窗口内的图片，而不会去加载位于之前的没有被加载的图片；

4. 可以提供一个阀值参数（`threshold`），表示可以提前加载一定范围内位于可视区域之外的图片；

5. 可以提供一个效果参数（`effect`），当图片加载后，可以选择使用普通显示（`none`）、淡入显示（`fadeIn`）两种显示效果；

6. 可以提供一个毫秒参数（`timeout`），用来对延迟加载的触发进行延迟处理。该参数的目的主要是通过延迟控制来避免每次滚动事件会多次触发懒加载处理。使用该参数设置后，图片的加载会有一点视觉延迟。建议根据实际需求选择使用，最好可以跟`viewport`和`threshold`参数共同使用来达到懒加载的最佳效果。

7. 提供了对非img元素做背景图片的懒加载处理；

8. 由于处于隐藏状态（display:none）的图片无法获得正确的位置信息，所以对这些图片应用懒加载将会在执行代码调用后被立即加载。对于选项卡、Slider切换等板块，其图片懒加载应使用切换组件本身自带的懒加载功能来进行实现。

## 效果欣赏

在介绍如何使用这款插件之前，大家可以先点击下面的链接查看相关的演示案例。

建议使用控制台中的网络面板来监测懒加载图片的请求。

1. [无效果](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/none.html)
2. [淡入效果](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn.html)
3. [淡入效果（提前加载）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-threshold.html)
4. [淡入效果（可视窗口）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-viewport.html)
5. [淡入效果（可视窗口 + 提前加载）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-viewport-threshold.html)
6. [淡入效果（可视窗口 + 延迟处理）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-viewport-timeout.html)
7. [淡入效果（多次函数调用）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-more-than-once.html)
8. [背景图片](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/background.html)


## HTML代码

为img元素实现懒加载处理，首先需要为该图片设置一张占位图片，然后将真实的图片地址通过 `data-src` 的自定义属性进行设置，从而让这些图片默认不会被加载：

```html

<img src="images/default.gif" data-src="images/theReal.jpg" alt="描述文本">

```


## 脚本调用

当我们完成HTML代码中的准备工作后，我们需要调用 `$.imgLazy()` 函数来完成操作：

```js

$.imgLazy();  //使用默认参数进行处理

```

`$.imgLazy()` 函数的默认参数如下：

```js

{
    selector: "img[data-src]",  // 懒加载图片的选择器查询字符串。
    src: "data-src",  			// 懒加载图片的真实url的保存属性。
    effect: "none",             // 用来指定加载图片时的效果，默认为"none"——即无效果，另外"fadeIn"——表示淡入效果。
    threshold: 0,               // 设置一个阀值，用来指定可以提前加载多少范围之外的图片。默认为0——不提前加载。当viewport为true时，表示前后两个方向都会做提前加载。
    thresholdBefore: 0,         // 设置一个阀值，当viewport为true时，用来单独指定可以向前加载多少范围之外的图片。默认为0——不提前加载。
    timeout: 0,                 // 懒加载行为响应的延迟时间，默认为0——表示不做延迟处理。
    viewport: false             // 是否仅加载可视窗口之内的图片，默认为false——表示将加载可视窗口内以及位于之前的所有图片。
}

```

常见的函数调用组合如下：

```js

//指定懒加载图片的选择器查询字符串，以及图片真实url的保存属性
$.imgLazy({ selector: "img[data-src]"，src: "data-src" });

//图片加载后淡入显示
$.imgLazy({ effect: "fadeIn" });

//提前加载200px范围位于可视区域之外的图片
$.imgLazy({ threshold: 200 });

//仅只加载可视窗口内的图片，并延迟20ms触发懒加载行为
$.imgLazy({ viewport: true, timeout: 20 });

```

## 推荐特性

### `timeout` 参数

该参数用来设置懒加载行为响应的延迟时间（单位：毫秒），其目的用于避免浏览器的滚动行为而导致懒加载处理被频繁触发。

该参数的一个主要使用场景，需要与 `viewport` 参数搭配使用才能达到预期效果——就是当页面快速从顶部滑行到底部后，由于设置了延迟响应，因此位于页面中间的图片并不会被加载，因此进一步加快了位于底部图片的加载响应时间，同时也避免了中间部分的图片被加载的过程（可能用户并不会浏览到这些图片）。

关于该特性的具体效果，请查看后面的场景案例：[淡入效果（可视窗口 + 延迟处理）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-viewport-timeout.html)

### 多次函数调用

这款图片懒加载的插件允许 `$.imgLazy()` 函数被多次调用。

第一次的调用，允许传递相关参数进行初始化操作——即绑定浏览器的滚动事件和处理行为。

而后续的每次调用，则表示对当前页面需要进行懒加载的图片进行重新初始化——即解除之前的行为绑定，并根据第一次调用传递的参数情况进行重新绑定。

关于该特性的具体效果，请查看后面的场景案例：[淡入效果（多次函数调用）](//htmlpreview.github.io/?https://github.com/springlong/jquery-imglazy/blob/master/demo/fadeIn-more-than-once.html)

### 事件绑定的自我解除

当页面中需要进行懒加载的图片都加载完毕后，程序将自动解除之前的事件绑定，避免浏览器进行不必要的响应行为。