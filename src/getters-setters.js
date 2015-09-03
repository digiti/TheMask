/* getters-setters.js */

TheMask.prototype.get = function(namespace) {
  if(this.routedGetters.hasOwnProperty(namespace)){
    return $.proxy(this.routedGetters[namespace], this)();
  } else {
    if(this.data.hasOwnProperty(namespace)){
      return this.data[namespace];
    } else {
      this.warn('get("' + namespace + '") - No data property found by this name.');
    }
  }
}

TheMask.prototype.set = function(namespace, value) {
  if(this.routedSetters.hasOwnProperty(namespace)){
    return $.proxy(this.routedSetters[namespace], this)(value);
  } else {
    if(this.data.hasOwnProperty(namespace)){
      if(value){
        this.data[namespace] = value;
      } else {
        this.warn('set("' + namespace + '",...) - No value was defined.');
      }
    } else {
      this.warn('set("' + namespace + '",...) - No data property found by this name.');
    }
  }
}

TheMask.prototype.add = function(namespace, value) {
  if(this.data.hasOwnProperty(namespace)){
    if(this.data[namespace]==null || this.data[namespace]==undefined){
      this.data[namespace] = [];
    }

    if(value){
      this.data[namespace].push(value);
    } else {
      this.warn('add("' + namespace + '",...) - No value was defined.');
    }
  } else {
    this.warn('add("' + namespace + '",...) - No data collection found by this name.');
  }
}

TheMask.prototype.routedGetters= {
  currentMask: function() {
    if(!this.data.currentMask){

      if(this.defs.hasOwnProperty('$p')){
        var p = this.defs.$p;
        var points = p.attr('points');

        this.data.currentMask = {
          id: "undefined",
          coords: points
        }
      } else {
        var masks = this.data.masks;

        if(masks.length){
          this.data.currentMask = masks[0];
        }
      }
    }

    return this.data.currentMask;
  }
}

TheMask.prototype.routedSetters= {
  currentMask: function(value) {
    this.data.currentMask = value;
  }
}
