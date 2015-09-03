# TheMask

This library makes it easy to add cross-browser animatable masks to images and shapes.

![TheMask.js at Digiti.be](http://client.digiti.be/digiti-website/github/themask-cover.png "TheMask.js at Digiti.be")

## Installation

Using Bower:

    bower install TheMask

Or grab the [source](https://github.com/wautersj/TheMask/dist/TheMask.js) ([minified](https://github.com/wautersj/TheMask/dist/TheMask.min.js)).

## Step 1: Create a TheMask object with markup input
```html
  <div id="iphone">
    <span class="image" data-dimensions="1000,1000" data-src="img/iphone.png"></span>
    <div  class="alternative rel-center">
      <p>Sorry, your browser does not support 'The Mask.'</p>
    </div>
  </div>
```

## Step 2: Add the coords-string for your mask to the markup
```html
  ...
  <span class="image" data-dimensions="1000,1000" data-src="img/iphone.png"></span>
  <span class="mask" data-coords="38,0 958,0 958,564 666,894 38,690" data-mask-id="myFirstMask"></span>
  ...
```


## Copyrights & License

DIGITI - 2015
MIT. See `LICENSE.txt` in this directory.
