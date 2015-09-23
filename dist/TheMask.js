(function(root, undefined) {

  "use strict";


/* TheMask main */

// Base function.
var TheMask = function(opt) {
  var optionsProcessed = this.processOptions(opt);
  var validated = this.validator();
  var analyzed = this.analyzer();
  var build = this.build();

  // this.info("build : " + build);
};


// Version.
TheMask.VERSION = '0.1.0';


// Export to the root, which is probably `window`.
root.TheMask = TheMask;


/* processOptions.js */

TheMask.prototype.processOptions = function(opt) {
  // Accesible properties
  this.data = {};
  this.defs = {};

  //Required Properties
  this.target = null;

  //Optional Properties
  this.duration = null;
  this.easing = null;

  //Cahce the options
  this.data.opt = opt;

  //Define required options
  this.requiredOptions = [
    'target',
  ]

  //Define default options
  this.defaultOptions = {
    'duration': 1000,
    'easing': 'easeInOutQuart'
  }

  //Setup data object
  this.data.image = null;
  this.data.solid = null;
  this.data.masks = null;
  this.data.alternative = null;
  this.data.targetID = null;

  // // // // // // // //

  var optionsApproved = true;

   //Setup Tracker object with provided options.
  var reference = this;
  for (var option in opt) {
    if(reference.hasOwnProperty(option) && reference[option]==null){
      reference[option] = opt[option];
    }
  }

  //Setup missing options with default value.
  for (var prop in reference) {
    if (reference[prop]==null && this.defaultOptions.hasOwnProperty(prop)) {
      var defVal = this.defaultOptions[prop];
      reference[prop] = defVal;
    }
  }

  //Warn about missing required options.
  for (var prop in reference) {
    if (reference[prop]==null && this.requiredOptions.indexOf(prop)!==-1) {
      optionsApproved = false;
      this.warn('Required option "' + prop + ' was not passed as option!');
    } else if(reference[prop]!==null && this.requiredOptions.indexOf(prop)!==-1) {
    }
  }

  //Cleanup reference
  delete this.requiredOptions;
  delete this.defaultOptions;

  //When all options are approved, clean up redundancy.
  if(optionsApproved){
    optionsApproved = null;
    return true;
  } else {
    this.warn('Not all options were accepted!');
    return false;
  }
}


/* validator.js */

TheMask.prototype.validator = function() {
  var validated = true;

  // Target must be an identifiër
  if(!(this.target && this.target.charAt(0)=="#")) {
    validated = false;
  } else {
    this.$el = $(this.target);
    this.set('targetID', this.target.substring(1));
    delete this.target;
  }

  return validated;
}


/* analyzer.js */

TheMask.prototype.analyzer = function() {
  var scope = this;

  var isJsDefined = function() {
    if(scope.data.opt.hasOwnProperty('image') &&
      scope.data.opt.hasOwnProperty('masks')){

      return true;
    } else {

      return false;
    }
  }

  var isMarkupDefined = function() {
    if((scope.$el.find('.image').length || scope.$el.find('.solid').length) &&
      scope.$el.find('.mask').length) {
      return true;
    } else {

      return false;
    }
  }

  // Collect alternative divs
  var collectAlternative = function(){
    var $alternative = $(scope.$el.find('.alternative'));
    scope.data.alternative = $alternative.html();

    $alternative.remove();
  }

  // Parse javascript-defined-arguments
  var parseDefs = function(){
    this.info('javascript data input not supported yet!');
    return false;
  }

  // Collect markup-defined-arguments
  var collectDefs = function(){
    var success = true;

    // Collect image & masks.
    var $image = scope.$el.find('.image');
    var $solid = scope.$el.find('.solid');
    var $masks = scope.$el.find('.mask');

    // Stash Image.
    if($image.length){
      var imageDimensions = $image.data('dimensions').split(',');
      var imageSrc = $image.data('src');

      if(imageDimensions.length==2 && imageSrc.length>1){
        var parsedDims = {
          width: Number(imageDimensions[0]),
          height: Number(imageDimensions[1])
        }

        // Setup image.
        scope.set("image", {
          src: imageSrc,
          dimensions: parsedDims
        });

        success = true;
      } else {
        scope.warn('Problems with image src or dimensions!');
        success = false;
      }
    }
    // } else {
    //   scope.warn('Problems with provided image!');
    //   success = false;
    // }

    if(success && $solid.length){
      var solidDimensions = $solid.data('dimensions').split(',');
      var solidFill = $solid.data('fill');
      var solidStroke = $solid.data('stroke');
      var solidStrokeWidth = $solid.data('strokeWidth');

      if(solidDimensions.length==2){
        var parsedDims = {
          width: Number(solidDimensions[0]),
          height: Number(solidDimensions[1])
        }

        // Setup image.
        scope.set("solid", {
          fill: solidFill,
          stroke: solidStroke,
          strokeWidth: solidStrokeWidth,
          dimensions: parsedDims
        });

        success = true;
      } else {
        scope.warn('Problems with solid dimensions!');
        success = false;
      }
    }
    // } else {
    //   scope.warn('Problems with provided solid!');
    //   success = false;
    // }

    if(!$image.length && !$solid.length){
      success = false;
      scope.warn('Image AND solid are missing!');
    }

    // Stash masks.
    if(success && $masks && $masks.length){
      $masks.each(function(index, el) {
        var $el = $(el);
        var maskId = $el.data('mask-id');
        var maskCoords = $el.data('coords');
        var parsedCoords = scope.parsePointStr($el.data('coords'));

        // Add new mask.
        scope.add('masks', {
          id: maskId,
          coords: maskCoords
        });

      });
    } else {
      scope.warn('Problems with provided masks!');
      success = false;
    }

    // return the result of the collection-flow.
    return success
  }


  if(this.$el) {
    collectAlternative();

    if(isJsDefined()) {
      return parseDefs();
    } else if(isMarkupDefined()) {
      return collectDefs();
    } else {
      this.warn('Analyzer failed: Couldn\'t determine js or markup input.');
      return false;
    }
  } else {
    this.warn('Analyzer failed: $el not found!');
    return false;
  }
}



/* build.js */

TheMask.prototype.build = function() {
  var scope = this;

  var build_SVG = function(){
    var svg = document.createElement('svg');
    var dims;

    if(scope.get('image')){
      dims = scope.get('image').dimensions;
    } else if(scope.get('solid')){
      dims = scope.get('solid').dimensions;
    }

    // Compute viewbox;
    var vbx = '0 0 ' + dims.width + ' ' + dims.height;

    // Create svg
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('version','1.1');
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svg.setAttribute('viewBox', vbx);
    // svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');

    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    // svg.setAttribute('width', dims.width);
    // svg.setAttribute('height', dims.height);

    return svg;
  };

  var build_Defs = function(){
    // Create Defenitions group
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    return defs;
  }

  var build_Polygon = function(mask){
    // Compute polygon ID
    var id = scope.get('targetID') + 'Polygon';

    // Compute init points
    var points = mask.coords;

    // Create polygon
    var p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttributeNS(null, 'id', id);
    p.setAttributeNS(null, 'points', points);

    return p;
  }

  var build_ClipPath = function(){
    // Compute clipPath ID
    var cID = scope.get('targetID') + 'Masker';

    // Create clipPath
    var cp = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    cp.setAttributeNS(null, 'id', cID);

    return cp;
  }

  var build__ClipPath_Use = function(){
    // Compute polygon ID
    var pIDHash = '#' + scope.get('targetID') + 'Polygon';

    // Create use
    var u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', pIDHash);

    return u;
  }

  var build_Solid = function(specs){
    var dims = specs.dimensions;

    // Compute polygon ID
    var pIDHash = '#' + scope.get('targetID') + 'Polygon';

    // Create image
    var s = document.createElementNS("http://www.w3.org/2000/svg", "use");
    s.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', pIDHash);
    s.setAttributeNS(null, 'x', 0);
    s.setAttributeNS(null, 'y', 0);

    if(specs.hasOwnProperty('fill')) {
      s.setAttributeNS(null, 'fill', specs.fill);
    }

    if(specs.hasOwnProperty('stroke')) {
      s.setAttributeNS(null, 'stroke', specs.stroke);
    }

    if(specs.hasOwnProperty('strokeWidth')) {
      s.setAttributeNS(null, 'stroke-width', specs.strokeWidth);
    }

    return s;
  };

  var build_Image = function(specs){
    var dims = specs.dimensions;

    // Compute polygon ID
    var cIDHash = '#' + scope.get('targetID') + 'Masker';

    // Compute polygon clip-path style
    var cStyle = 'clip-path:url(' + cIDHash + ')';

    // Create image
    var img = document.createElementNS("http://www.w3.org/2000/svg", "image");

    img.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', specs.src);
    img.setAttributeNS(null, 'width', dims.width);
    img.setAttributeNS(null, 'height', dims.height);

    // Apply masking
    img.setAttributeNS(null, 'style', cStyle);

    watchImgLoad(specs.src);

    return img;
  };

  function watchImgLoad(reference) {
    var img = new Image();
    img.onload = function(event){
      if(scope.onLoad !== undefined){
        scope.onLoad(event);
      }
    }

    img.src = reference;
  }

  // Clean old markup.
  this.$el.html('');

  // Set values.
  var mask = scope.get('currentMask');
  var image = this.get('image');
  var solid = this.get('solid');

  // Build different elements.
  this.defs.$svg = $(build_SVG());
  this.defs.$defs = $(build_Defs());
  this.defs.$p = $(build_Polygon(mask));
  this.defs.$cp = $(build_ClipPath());
  this.defs.$u = $(build__ClipPath_Use());

  // Specify defenitions.
  this.defs.$defs.append(this.defs.$p);
  this.defs.$cp.append(this.defs.$u);

  // Concatinate elements.
  this.defs.$svg.append(this.defs.$defs);
  this.defs.$svg.append(this.defs.$cp);


  if(this.get('solid')){
    this.defs.$solid = $(build_Solid(solid));
    this.defs.$svg.append(this.defs.$solid);
  }

  if(this.get('image')){
    this.defs.$img = $(build_Image(image));
    this.defs.$svg.append(this.defs.$img);
  }

  // Add master element
  this.$el.append(this.defs.$svg);

  return true;
}


/* build.js */

TheMask.prototype.shapeMask = function(opt) {
  var scope = this;

  if(!opt) {
    return;
  }

  var maskID = opt.id;
  var duration = opt.duration || this.duration;
  var easing = opt.easing || this.easing;

  var currentMask = this.get('currentMask');
  var toMask = this.findMask(maskID);

  if(currentMask.id==toMask.id) {
    // console.log('anime ignored, allready on mask-id: ' + currentMask.id);
    return false;
  }

  // Solve issue when starting in the middle of an other animation.
  scope.set('currentMask', undefined);
  currentMask = this.get('currentMask');

  if(!toMask){
    return false;
  } else {
    scope.set('currentMask', undefined);
  }

  var fromPointsStr = currentMask.coords;
  var toPointsStr = toMask.coords;

  var pointsFrom = this.parsePointStr(fromPointsStr);
  var pointsTo = this.parsePointStr(toPointsStr);

  var $polygon = this.defs.$p;

  var differences = [];
  $(pointsFrom).each(function(index, el) {
    var cordsTo = pointsTo[index];
    var cordsFrom = pointsFrom[index];

    differences.push({
      x: cordsTo.x - cordsFrom.x,
      y: cordsTo.y - cordsFrom.y
    });
  });

  function _transform(perc) {
    var newCords = [];
    $(pointsFrom).each(function(index, el) {
      var cordsFrom = pointsFrom[index];
      var cordsDiff = differences[index];

      newCords.push([
        cordsFrom.x + Math.round(cordsDiff.x*perc),
        cordsFrom.y + Math.round(cordsDiff.y*perc)
      ].join(','));
    });

    var newPointsString = newCords.join(' ');
    $polygon.attr('points', newPointsString);
  }

  if(this.hasOwnProperty('animation')){
    this.animation.clearQueue();
    this.animation.stop();

    delete this.animation;
  }

  this.animation = $({perc:0});
  this.animation.animate({perc: 1}, {
    duration: duration,
    easing: easing,
    step: function(e) {
      _transform(this.perc);
    },
    complete: function(e) {
      _transform(this.perc);

      // when the animation has finished, you may overwrite
      // the currentmask to the destination state.
      scope.set('currentMask', toMask);
      // console.log('anime complete');

      if(opt.hasOwnProperty('callback')){
        opt.callback();
      }
    }
  });
}


/* getters-setters.js */

TheMask.prototype.get = function(namespace) {
  if(this.routedGetters.hasOwnProperty(namespace)){
    return $.proxy(this.routedGetters[namespace], this)();
  } else {
    if(this.data.hasOwnProperty(namespace)){
      return this.data[namespace];
    } else {
      this.warn('get("' + namespace + '") - No data property found by this name.');
    }
  }
}

TheMask.prototype.set = function(namespace, value) {
  if(this.routedSetters.hasOwnProperty(namespace)){
    return $.proxy(this.routedSetters[namespace], this)(value);
  } else {
    if(this.data.hasOwnProperty(namespace)){
      if(value){
        this.data[namespace] = value;
      } else {
        this.warn('set("' + namespace + '",...) - No value was defined.');
      }
    } else {
      this.warn('set("' + namespace + '",...) - No data property found by this name.');
    }
  }
}

TheMask.prototype.add = function(namespace, value) {
  if(this.data.hasOwnProperty(namespace)){
    if(this.data[namespace]==null || this.data[namespace]==undefined){
      this.data[namespace] = [];
    }

    if(value){
      this.data[namespace].push(value);
    } else {
      this.warn('add("' + namespace + '",...) - No value was defined.');
    }
  } else {
    this.warn('add("' + namespace + '",...) - No data collection found by this name.');
  }
}

TheMask.prototype.routedGetters= {
  currentMask: function() {
    if(!this.data.currentMask){

      if(this.defs.hasOwnProperty('$p')){
        var p = this.defs.$p;
        var points = p.attr('points');

        this.data.currentMask = {
          id: "undefined",
          coords: points
        }
      } else {
        var masks = this.data.masks;

        if(masks.length){
          this.data.currentMask = masks[0];
        }
      }
    }

    return this.data.currentMask;
  }
}

TheMask.prototype.routedSetters= {
  currentMask: function(value) {
    this.data.currentMask = value;
  }
}


/* helpers.js */

TheMask.prototype.parsePointStr = function(str) {
  var points = [];

  if(str){
    $(str.split(' ')).each(function(index, el) {
      var cords = el.split(',');

      points.push({
        x: Number(cords[0]),
        y: Number(cords[1])
      });
    });
  }

  return points;
}

TheMask.prototype.findMask = function(maskID){
  var found = null;

  for (var i = this.data.masks.length - 1; i >= 0; i--) {
    var _mask = this.data.masks[i];
    if(_mask.id==maskID){
      found = _mask;
    }
  };

  return found;
}

TheMask.prototype.resetImage = function(image){
  var $img = this.defs.$img;

  var orgImage = this.data.image;

  if(image.hasOwnProperty('src')) {
    // Tag the old image.
    var _image = this.$el.find('image');
    _image.attr('class','TheMask-remove');

    var dims = orgImage.dimensions;

    // Compute polygon ID
    var pIDHash = '#' + this.get('targetID') + 'Masker';

    // Compute polygon clip-path style
    var cpStyle = 'clip-path:url(' + pIDHash + ');display:none;';

    // Create image
    var img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', image.src);
    img.setAttributeNS(null, 'width', dims.width);
    img.setAttributeNS(null, 'height', dims.height);

    // Apply masking
    img.setAttributeNS(null, 'style', cpStyle);


    var duration = image.duration || this.duration;


    this.defs.$svg.append(img);

    $(img).fadeIn(duration);
    $(_image).fadeOut(duration);

    setTimeout(function(){
      _image.remove();
      _image = undefined;

      if(image.hasOwnProperty('callback')) {
        image.callback();
      }
    }, duration);


    if(image.hasOwnProperty('shapeMask')) {
      this.shapeMask({id:image.shapeMask,duration:duration});
    }
  } else {
    alert('TheMask: "src" attribute on "resetImage" command is missing.');
  }
}


/* console.js */

TheMask.prototype.log = function(s) {
  console.log('TheMask: ' + s);
}

TheMask.prototype.warn = function(s) {
  console.warn('TheMask: ' + s);
}

TheMask.prototype.info = function(s) {
  console.info('TheMask: ' + s);
}


}(this));
