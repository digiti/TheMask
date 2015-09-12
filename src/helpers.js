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
