# TheMask

This library makes it easy to add cross-browser animatable masks to images and shapes.

![TheMask.js at Digiti.be](http://client.digiti.be/digiti-website/github/themask-cover.png "TheMask.js at Digiti.be")

## Installation

Using Bower:

    bower install https://github.com/digiti/TheMask.git --save

Or grab the [source](https://github.com/wautersj/TheMask/dist/TheMask.js) ([minified](https://github.com/wautersj/TheMask/dist/TheMask.min.js)).

## Step 1: Setup your markup
The mask will be wrapped in a container, we define our conttainer with an ID (#myMask)

```html
  <div id="myMask">
    <span class="image" data-dimensions="1000,1000" data-src="img/asset.png"></span>
    <span class="mask" data-coords="38,0 998,0 958,604 586,894 38,750" data-mask-id="myFirstMask"></span>
  </div>
```

## Step 2: Add first mask
We can now add our first mask with a coordinates string to our container like so:
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

## (optional): Solid
You might need a shape instead of an image. Just replace the image for a solid like so:
You can define the solid's fill, stroke color and stroke width.
```html
  ...
  <span class="solid" data-dimensions="1000,1000" data-fill="FF0000" data-stroke="#0000FF" data-stroke-width="4">
  ...
```

## (optional): Image with Stroke
You'd like a stroke around your image? Fine! Just add both the image and the solid.
For the fill, we'll just use: transparent
```html
  ...
  <span class="image" data-dimensions="1000,1000" data-src="img/asset.png"></span>
  <span class="solid" data-dimensions="1000,1000" data-fill="transparent" data-stroke="#0000FF" data-stroke-width="4">
  ...
```


## Copyrights & License

DIGITI - 2015
MIT. See `LICENSE.txt` in this directory.
