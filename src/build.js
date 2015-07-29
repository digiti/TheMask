/* build.js */

TheMask.prototype.build = function() {
  var scope = this;

  var build_SVG = function(){
    var svg = document.createElement('svg');
    var dims = scope.data.image.dimensions;

    // Compute viewbox;
    var vbx = '0 0 ' + dims.width + ' ' + dims.height;

    // Create svg
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('version','1.1');
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svg.setAttribute('viewBox', vbx);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');

    return svg;
  };

  var build_ClipPath = function(){
    // Compute polygon ID
    var pID = scope.get('targetID') + 'Masker';

    // Create clipPath
    var cp = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    cp.setAttributeNS(null, 'id', pID);

    return cp;
  }

  var build_Polygon = function(){
    // Compute init points
    var mask = scope.get('currentMask');
    var points = mask.coords;

    // Create polygon
    var p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttributeNS(null, 'points', points);

    return p;
  }

  var build_Image = function(){
    var specs = scope.data.image;
    var dims = specs.dimensions;

    // Compute polygon ID
    var pIDHash = '#' + scope.get('targetID') + 'Masker';

    // Compute polygon clip-path style
    var cpStyle = 'clip-path:url(' + pIDHash + ')';

    // Create image
    var img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', specs.src);
    img.setAttributeNS(null, 'width', dims.width);
    img.setAttributeNS(null, 'height', dims.height);

    img.onload = function(){
      scope.log('Loaded: xlink:href: ' + specs.src);
    }

    // Apply masking
    img.setAttributeNS(null, 'style', cpStyle);

    return img;
  };

  // Clean old markup.
  this.$el.html('');

  // Build different elements.
  this.defs.$svg = $(build_SVG());
  this.defs.$cp = $(build_ClipPath());
  this.defs.$p = $(build_Polygon());
  this.defs.$img = $(build_Image());

  // Concatinate elements.
  this.defs.$cp.append(this.defs.$p);
  this.defs.$svg.append(this.defs.$cp);
  this.defs.$svg.append(this.defs.$img);

  // Add master element
  this.$el.append(this.defs.$svg);

  return true;
}
