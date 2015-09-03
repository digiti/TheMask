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
