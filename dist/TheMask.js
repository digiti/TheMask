(function(root, undefined) {

  "use strict";


/* TheMask main */

// Base function.
var TheMask = function(opt) {
  var optionsProcessed = this.processOptions(opt);
  var validated = this.validator();

  console.log(optionsProcessed);
  console.log(validated);
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

  this.requiredOptions = [
    'target',
  ]

  this.defaultOptions = {
    'duration': 1000,
    'easing': 'easeInOutQuart'
  }

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
  }

  return validated;
}


/* analyzer.js */

TheMask.prototype.analyzer = function() {

  // Collect alternative divs
  var collectAlternatives = function(){
    var $alternative = $(this.$el.find('.alternative'));
    this.data.alternative = $alternative.html();

    $alternative.remove();
  }

  // Collect markup-defined-arguments
  var collectDefs = function(){

  }

  // Parse javascript-defined-arguments
  var parseDefs = function(){

  }
}



/* analyzer.js */

TheMask.prototype.get = function(namespace) {
  if(this.data.hasOwnProperty(namespace)){
    return this.data[namespace];
  } else {
    this.warn('get("' + namespace + '") - No data property found by this name.');
  }
}

TheMask.prototype.set = function(namespace, value) {
  if(this.data.hasOwnProperty(namespace)){
    return this.data[namespace];
  } else {
    this.warn('set("' + namespace + '",...) - No data property found by this name.');
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
