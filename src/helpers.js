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
