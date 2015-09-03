/* build.js */

TheMask.prototype.shapeMask = function(opt) {
  var scope = this;

  if(!opt) {
    return;
  }

  var maskID = opt.id;
  var duration = opt.duration || this.duration;

  var currentMask = this.get('currentMask');
  var toMask = this.findMask(maskID);

  if(currentMask.id==toMask.id) {
    // console.log('anime ignored, allready on mask-id: ' + currentMask.id);
    return false;
  }

  // Solve issue when starting in the middle of an other animation.
  scope.set('currentMask', undefined);
  currentMask = this.get('currentMask');

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

  if(this.hasOwnProperty('animation')){
    this.animation.clearQueue();
    this.animation.stop();

    delete this.animation;
  }

  this.animation = $({perc:0});
  this.animation.animate({perc: 1}, {
    duration: duration,
    easing: scope.easing,
    step: function(e) {
      _transform(this.perc);
    },
    complete: function(e) {
      _transform(this.perc);

      // when the animation has finished, you may overwrite
      // the currentmask to the destination state.
      scope.set('currentMask', toMask);
      // console.log('anime complete');

      if(opt.hasOwnProperty('callback')){
        opt.callback();
      }
    }
  });
}
