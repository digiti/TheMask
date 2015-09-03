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
