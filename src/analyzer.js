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

