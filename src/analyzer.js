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

