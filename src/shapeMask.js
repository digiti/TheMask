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
