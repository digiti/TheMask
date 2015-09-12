# TheMask

This library makes it easy to add cross-browser animatable masks to images and shapes.

![TheMask.js at Digiti.be](http://client.digiti.be/digiti-website/github/themask-cover.png "TheMask.js at Digiti.be")

## Installation

Using Bower:

    bower install https://github.com/digiti/TheMask.git --save

Or grab the [source](https://github.com/wautersj/TheMask/dist/TheMask.js) ([minified](https://github.com/wautersj/TheMask/dist/TheMask.min.js)).

## Step 1: Setup your markup
The mask will be wrapped in a container, we define this conttainer with an ID (#iphone)

```html
  <div id="iphone">
    <span class="image" data-dimensions="1000,1000" data-src="img/iphone.png"></span>
    <div  class="alternative rel-center">
      <p>Sorry, your browser does not support 'The Mask.'</p>
    </div>
  </div>
```

## Step 2: Add first coordinates string
We can now add our first coordinaes string, eg: mask, to our container like so:
```html
  ...
  <span class="mask" data-coords="38,0 958,0 958,564 666,894 38,690" data-mask-id="myFirstMask"></span>
  ...
```

## Step 3: Add more coordinates ...
Maybe we'd like some more mask states, we can add them aswell
```html
  ...
  <span class="mask" data-coords="38,0 998,0 958,604 586,894 38,750" data-mask-id="mySecondMask"></span>
  <span class="mask" data-coords="0,0 1000,0 1000,0 1000,1000 0,1000" data-mask-id="myThirdMask"></span>
  ...
```


## Copyrights & License

DIGITI - 2015
MIT. See `LICENSE.txt` in this directory.
