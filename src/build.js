/* build.js */

TheMask.prototype.build = function() {
  var scope = this;

  var build_SVG = function(){
    var svg = document.createElement('svg');
    var dims;

    if(scope.get('image')){
      dims = scope.get('image').dimensions;
    } else if(scope.get('solid')){
      dims = scope.get('solid').dimensions;
    }

    // Compute viewbox;
    var vbx = '0 0 ' + dims.width + ' ' + dims.height;

    // Create svg
    var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('version','1.1');
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    svg.setAttribute('viewBox', vbx);
    // svg.setAttribute('preserveAspectRatio', 'xMinYMin slice');

    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    // svg.setAttribute('width', dims.width);
    // svg.setAttribute('height', dims.height);

    return svg;
  };

  var build_Defs = function(){
    // Create Defenitions group
    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    return defs;
  }

  var build_Polygon = function(mask){
    // Compute polygon ID
    var id = scope.get('targetID') + 'Polygon';

    // Compute init points
    var points = mask.coords;

    // Create polygon
    var p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    p.setAttributeNS(null, 'id', id);
    p.setAttributeNS(null, 'points', points);

    return p;
  }

  var build_ClipPath = function(){
    // Compute clipPath ID
    var cID = scope.get('targetID') + 'Masker';

    // Create clipPath
    var cp = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    cp.setAttributeNS(null, 'id', cID);

    return cp;
  }

  var build__ClipPath_Use = function(){
    // Compute polygon ID
    var pIDHash = '#' + scope.get('targetID') + 'Polygon';

    // Create use
    var u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', pIDHash);

    return u;
  }

  var build_Solid = function(specs){
    var dims = specs.dimensions;

    // Compute polygon ID
    var pIDHash = '#' + scope.get('targetID') + 'Polygon';

    // Create image
    var s = document.createElementNS("http://www.w3.org/2000/svg", "use");
    s.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', pIDHash);
    s.setAttributeNS(null, 'x', 0);
    s.setAttributeNS(null, 'y', 0);

    if(specs.hasOwnProperty('fill')) {
      s.setAttributeNS(null, 'fill', specs.fill);
    }

    if(specs.hasOwnProperty('stroke')) {
      s.setAttributeNS(null, 'stroke', specs.stroke);
    }

    if(specs.hasOwnProperty('strokeWidth')) {
      s.setAttributeNS(null, 'stroke-width', specs.strokeWidth);
    }

    return s;
  };

  var build_Image = function(specs){
    var dims = specs.dimensions;

    // Compute polygon ID
    var cIDHash = '#' + scope.get('targetID') + 'Masker';

    // Compute polygon clip-path style
    var cStyle = 'clip-path:url(' + cIDHash + ')';

    // Create image
    var img = document.createElementNS("http://www.w3.org/2000/svg", "image");

    img.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', specs.src);
    img.setAttributeNS(null, 'width', dims.width);
    img.setAttributeNS(null, 'height', dims.height);

    // Apply masking
    img.setAttributeNS(null, 'style', cStyle);

    watchImgLoad(specs.src);

    return img;
  };

  function watchImgLoad(reference) {
    var img = new Image();
    img.onload = function(event){
      if(scope.onLoad !== undefined){
        scope.onLoad(event);
      }
    }

    img.src = reference;
  }

  // Clean old markup.
  this.$el.html('');

  // Set values.
  var mask = scope.get('currentMask');
  var image = this.get('image');
  var solid = this.get('solid');

  // Build different elements.
  this.defs.$svg = $(build_SVG());
  this.defs.$defs = $(build_Defs());
  this.defs.$p = $(build_Polygon(mask));
  this.defs.$cp = $(build_ClipPath());
  this.defs.$u = $(build__ClipPath_Use());

  // Specify defenitions.
  this.defs.$defs.append(this.defs.$p);
  this.defs.$cp.append(this.defs.$u);

  // Concatinate elements.
  this.defs.$svg.append(this.defs.$defs);
  this.defs.$svg.append(this.defs.$cp);


  if(this.get('solid')){
    this.defs.$solid = $(build_Solid(solid));
    this.defs.$svg.append(this.defs.$solid);
  }

  if(this.get('image')){
    this.defs.$img = $(build_Image(image));
    this.defs.$svg.append(this.defs.$img);
  }

  // Add master element
  this.$el.append(this.defs.$svg);

  return true;
}
