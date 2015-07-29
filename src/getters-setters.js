/* analyzer.js */

TheMask.prototype.get = function(namespace) {
  if(this.data.hasOwnProperty(namespace)){
    return this.data[namespace];
  } else {
    this.warn('get("' + namespace + '") - No data property found by this name.');
  }
}

TheMask.prototype.set = function(namespace, value) {
  if(this.data.hasOwnProperty(namespace)){
    return this.data[namespace];
  } else {
    this.warn('set("' + namespace + '",...) - No data property found by this name.');
  }
}

