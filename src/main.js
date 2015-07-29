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
