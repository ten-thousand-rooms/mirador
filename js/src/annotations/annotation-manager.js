// XXX seong

(function($) {
  
  var AnnotationManager = function (options) {
    jQuery.extend(this, {
    }, options);

    this.init();
  };
  
  AnnotationManager.prototype = {
    
    init: function () {
      
    }

  };
  
  var instance = null;
  
  $.getAnnotationManager = function () {
    if (!instance) {
      instance = new AnnotationManager();
    }
    return instance;
  };
  
})(Mirador);
