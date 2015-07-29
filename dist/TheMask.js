(function(root, undefined) {

  "use strict";


/* TheMask main */

// Base function.
var TheMask = function(opt) {
  var optionsProcessed = this.processOptions(opt);
  var validated = this.validator();
  var analyzed = this.analyzer();
  var build = this.build();

  this.info("build : " + build);
};


// Version.
TheMask.VERSION = '0.0.1';


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
    if(scope.$el.find('.image').length &&
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
    var $image = $(scope.$el.find('.image')[0]);
    var $masks = scope.$el.find('.mask');

    // Stash Image.
    if($image){
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
    } else {
      scope.warn('Problems with provided image!');
      success = false;
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
    var dims = scope.data.image.dimensions;

    // Compute viewbox;
    var vbx = '0 0 ' + dims.width + ' ' + dims.height;

    // Create svg
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('version','1.1');
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svg.setAttribute('viewBox', vbx);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');

    return svg;
  };

  var build_ClipPath = function(){
    // Compute polygon ID
    var pID = scope.get('targetID') + 'Masker';

    // Create clipPath
    var cp = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    cp.setAttributeNS(null, 'id', pID);

    return cp;
  }

  var build_Polygon = function(){
    // Compute init points
    var mask = scope.get('currentMask');
    var points = mask.coords;

    // Create polygon
    var p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttributeNS(null, 'points', points);

    return p;
  }

  var build_Image = function(){
    var specs = scope.data.image;
    var dims = specs.dimensions;

    // Compute polygon ID
    var pIDHash = '#' + scope.get('targetID') + 'Masker';

    // Compute polygon clip-path style
    var cpStyle = 'clip-path:url(' + pIDHash + ')';

    // Create image
    var img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', specs.src);
    img.setAttributeNS(null, 'width', dims.width);
    img.setAttributeNS(null, 'height', dims.height);

    img.onload = function(){
      scope.log('Loaded: xlink:href: ' + specs.src);
    }

    // Apply masking
    img.setAttributeNS(null, 'style', cpStyle);

    return img;
  };

  // Clean old markup.
  this.$el.html('');

  // Build different elements.
  this.defs.$svg = $(build_SVG());
  this.defs.$cp = $(build_ClipPath());
  this.defs.$p = $(build_Polygon());
  this.defs.$img = $(build_Image());

  // Concatinate elements.
  this.defs.$cp.append(this.defs.$p);
  this.defs.$svg.append(this.defs.$cp);
  this.defs.$svg.append(this.defs.$img);

  // Add master element
  this.$el.append(this.defs.$svg);

  return true;
}


/* build.js */

TheMask.prototype.shapeMask = function(maskID) {
  var scope = this;

  var currentMask = this.get('currentMask');
  var toMask = this.findMask(maskID);

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

  $({perc:0}).animate({perc: 1}, {
    duration: scope.duration,
    easing: scope.easing,
    step: function(e) {
      _transform(this.perc);
    },
    complete: function(e) {
      _transform(this.perc);

      // when the animation has finished, you may overwrite
      // the currentmask to the destination state.
      scope.set('currentMask', toMask);

      // if(callback){
      //   callback();
      // }
    }
  });
}


/* analyzer.js */

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
    if(!this.data.hasOwnProperty('currentMask')){
      var masks = this.data.masks;

      if(masks.length){
        this.data.currentMask = masks[0];
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
