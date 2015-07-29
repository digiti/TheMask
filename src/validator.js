/* validator.js */

TheMask.prototype.validator = function() {
  var validated = true;

  // Target must be an identifiër
  if(!(this.target && this.target.charAt(0)=="#")) {
    validated = false;
  } else {
    this.$el = $(this.target);
  }

  return validated;
}
